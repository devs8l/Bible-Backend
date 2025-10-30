// controllers/delhiveryController.js
import delhiveryAPI from "../utils/delhiveryService.js";

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

// ✅ 3. Shipment Tracking
export const trackShipment = async (req, res) => {
  try {
    const { waybill } = req.query;
    const response = await delhiveryAPI.get(`/api/v1/packages/json/?waybill=${waybill}`);
    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data || error.message,
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


// ✅ 6. Shipment Creation
export const createShipment = async (req, res) => {
  try {
    const { shipment } = req.body;

    const response = await delhiveryAPI.post(`/api/cmu/create.json`, {
      format: "json",
      data: {
        shipments: [shipment],
        pickup_location: {
          name: "warehouse_name", // change to your warehouse alias registered with Delhivery
        },
      },
    });

    res.json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data || error.message,
    });
  }
};