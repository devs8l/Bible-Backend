import delhiveryAPI from "../utils/delhiveryService.js";
import orderModel from "../models/orderModel.js";
import axios from "axios";

// ✅ 1. Check Pincode Serviceability
export const checkServiceability = async (req, res) => {
  try {
    const { pincode } = req.query;
    const response = await delhiveryAPI.get(`/api/pin-codes/json/?filter_codes=${pincode}`);
    
    res.json({
      success: true,
      serviceable: response.data.delivery_codes && response.data.delivery_codes.length > 0,
      data: response.data,
    });
  } catch (error) {
    console.error("Delhivery Serviceability Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data || error.message,
    });
  }
};

// ✅ 2. Calculate Shipping Cost
export const calculateShipping = async (req, res) => {
  try {
    const { origin, destination, weight, paymentType } = req.query;
    const url = `/api/kinko/v1/invoice/charges/.json?md=S&ss=Delivered&o_pin=${origin}&d_pin=${destination}&cgm=${weight}&pt=${paymentType}`;
    const response = await delhiveryAPI.get(url);
    
    res.json({ 
      success: true, 
      data: response.data 
    });
  } catch (error) {
    console.error("Shipping calculation error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data || error.message,
    });
  }
};

// ✅ 3. Shipment Tracking with Auto Status Update
export const trackShipment = async (req, res) => {
  try {
    const { awb, refId } = req.query;

    if (!awb || !refId) {
      return res.status(400).json({ success: false, message: "Missing AWB or refId" });
    }

    const DELHIVERY_API_KEY = process.env.DELHIVERY_API_TOKEN;
    if (!DELHIVERY_API_KEY) {
      return res.status(500).json({ success: false, message: "Delhivery API key missing" });
    }

    const url = `https://track.delhivery.com/api/v1/packages/json/?waybill=${awb}&ref_ids=${refId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Token ${DELHIVERY_API_KEY}`,
        Accept: "application/json",
      },
    });

    // Auto-update order status based on tracking data
    if (response.data && response.data.ShipmentData && response.data.ShipmentData.length > 0) {
      const shipmentData = response.data.ShipmentData[0].Shipment;
      const delhiveryStatus = shipmentData.Status.Status;
      
      // Map Delhivery status to our order status
      const statusMap = {
        'In Transit': 'shipped',
        'Out for Delivery': 'shipped',
        'Delivered': 'delivered',
        'Not Picked': 'processing',
        'Manifested': 'processing',
        'Lost': 'cancelled',
        'RTO': 'cancelled',
        'Dispatched': 'shipped',
        'Pending': 'processing'
      };

      const mappedStatus = statusMap[delhiveryStatus] || 'processing';
      
      // Update order status in database
      try {
        await orderModel.findByIdAndUpdate(refId, { 
          status: mappedStatus 
        });
        
        console.log(`✅ Auto-updated order ${refId} status to: ${mappedStatus} (Delhivery: ${delhiveryStatus})`);
      } catch (dbError) {
        console.error('Database update error:', dbError);
        // Continue with tracking response even if DB update fails
      }
    }

    // Send API response to frontend
    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Delhivery Tracking Error:", error.response?.data || error.message);

    res.status(error.response?.status || 500).json({
      success: false,
      message: "Unable to fetch tracking info",
      error: error.response?.data || error.message,
    });
  }
};

// ✅ 4. Pickup Request Creation
export const createPickupRequest = async (req, res) => {
  try {
    const { pickup_date, pickup_time, pickup_location, expected_package_count } = req.body;
    const response = await delhiveryAPI.post(`/fm/request/new/`, {
      pickup_date,
      pickup_time,
      pickup_location,
      expected_package_count,
    });
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data || error.message,
    });
  }
};

// ✅ 5. Expected TAT
export const expectedTAT = async (req, res) => {
  try {
    const { origin_pin, destination_pin, expected_pickup_date } = req.query;

    const response = await delhiveryAPI.get(
      `/api/dc/expected_tat`,
      {
        params: {
          origin_pin,
          destination_pin,
          mot: "S",
          pdt: "B2C",
          expected_pickup_date,
        },
        headers: {
          Authorization: `Token ${process.env.DELHIVERY_API_TOKEN}`,
        },
      }
    );

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Expected TAT Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data || error.message,
    });
  }
};


/* ✅ 6. Shipment Creation (Fixed)
export const createShipment = async (req, res) => {
  try {
    const { shipments } = req.body;

    // Construct the payload as Delhivery expects (form-encoded data)
    const payload = new URLSearchParams({
      format: "json",
      data: JSON.stringify({
        shipments,
        pickup_location: {
          name: "47-1, JayaSree Estates, Singaipally, NISA, Hakimpet, NISA, Shamirpet Mandal, Medchal & Malkajgiri District, Hyderabad, Telangana, India 500 078." // use your exact warehouse alias name from Delhivery Dashboard
        }
      })
    });

    const response = await delhiveryAPI.post(`/api/cmu/create.json`, payload.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Token ${process.env.DELHIVERY_API_TOKEN}`,
      },
    });

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Shipment creation error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data || error.message,
    });
  }
};*/


// ✅ 7. Shipment Creation 
export const createShipmentForOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // 1️⃣ Find order
    const order = await orderModel.findById(orderId);
    if (!order)
      return res.status(404).json({ success: false, message: "Order not found" });

    const orderCode = `#${order._id.toString().slice(-6).toUpperCase()}`;

    // 2️⃣ Build shipment payload (based on Delhivery’s format)
    const shipment = {
      name: order.name,
      add: order.address.street || order.address.line1,
      city: order.address.city,
      state: order.address.state,
      pin: order.address.zip,
      phone: order.phone,
      order: orderCode,
      payment_mode: order.paymentMethod === "COD" ? "COD" : "Prepaid",
      total_amount: order.amount,
      cod_amount: order.paymentMethod === "COD" ? order.amount : 0,
      products_desc: order.items.map(i => i.name).join(", "),
      hsn_code: "49019900",
      weight: "0.5",
      pieces: order.items.length,
      shipping_mode: "Surface",
      return_add: "47-1, JayaSree Estates, Singaipally, NISA, Hakimpet, Hyderabad",
      return_city: "Hyderabad",
      return_state: "Telangana",
      return_pin: "500078",
      return_country: "India",
      seller_name: "CentroBiblia",
      seller_add: "47-1, JayaSree Estates, Singaipally, NISA, Hakimpet, Hyderabad",
      seller_inv: `INV-${Date.now()}`,
      quantity: order.items.length,
      shipment_width: "10",
      shipment_height: "5",
      address_type: "Home",
    };

    // 3️⃣ Form-encode payload (as required by Delhivery)
    const payload = new URLSearchParams({
      format: "json",
      data: JSON.stringify({
        shipments: [shipment],
        pickup_location: {
          name: "47-1, JayaSree Estates, Singaipally, NISA, Hakimpet, NISA, Shamirpet Mandal, Medchal & Malkajgiri District, Hyderabad, Telangana, India 500 078.", // must match your warehouse alias in Delhivery panel
        },
      }),
    });

    // 4️⃣ Call Delhivery API
    const response = await delhiveryAPI.post(`/api/cmu/create.json`, payload.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Token ${process.env.DELHIVERY_API_TOKEN}`,
      },
    });

    const data = response.data;

    // 5️⃣ Handle Delhivery Response
    if (!data?.packages?.length) {
      return res.status(400).json({
        success: false,
        message: data.rmk || "Shipment creation failed",
        data,
      });
    }

    const awb = data.packages[0].waybill;
    const trackingUrl = `https://www.delhivery.com/track/package/${awb}`;

    // 6️⃣ Update order with shipment details
    order.shipment = {
      awb,
      tracking_url: trackingUrl,
      courier: "Delhivery",
      shipment_status: "Created",
      created_at: new Date(),
    };
    await order.save();

    // 7️⃣ Send success response
    res.json({
      success: true,
      message: "Shipment created successfully",
      orderId: order._id,
      tracking: order.shipment,
    });
  } catch (error) {
    console.error("Shipment Creation Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data || error.message,
    });
  }
};


// Get Shipment Label (Delhivery PDF)
export const getShipmentLabel = async (req, res) => {
  try {
    const { awb } = req.params;

    // Step 1️⃣ — Request PDF link from Delhivery
    const response = await axios.get(
      `https://track.delhivery.com/api/p/packing_slip?wbns=${awb}&pdf=true&pdf_size=A4`,
      {
        headers: {
          Authorization: `Token ${process.env.DELHIVERY_API_TOKEN}`,
        },
      }
    );

    // Step 2️⃣ — Extract the actual PDF download link
    const pdfUrl = response.data?.packages?.[0]?.pdf_download_link;
    if (!pdfUrl) {
      return res.status(400).json({
        success: false,
        message: "Delhivery did not return a PDF link.",
        rawResponse: response.data,
      });
    }

    // Step 3️⃣ — Download the PDF from the returned S3 link
    const pdfRes = await axios.get(pdfUrl, { responseType: "arraybuffer" });
    const pdfBuffer = Buffer.from(pdfRes.data, "binary");

    // Step 4️⃣ — Send PDF back to frontend
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${awb}_label.pdf"`
    );
    return res.send(pdfBuffer);
  } catch (err) {
    console.error("📄 PDF Download Error:", err.message);
    if (err.response) {
      const errorText = Buffer.from(err.response.data || "").toString("utf8");
      console.log("❌ Delhivery Error Text:", errorText);
      return res.status(err.response.status || 500).json({
        success: false,
        message: "Delhivery API error.",
        apiError: errorText.substring(0, 200),
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server or network error while fetching label",
      error: err.message,
    });
  }
};