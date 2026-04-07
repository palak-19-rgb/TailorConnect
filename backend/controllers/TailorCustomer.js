const TailorCustomer = require("../models/TailorCustomer");
const Customer = require("../models/Customer");

// ✅ ADD CLIENT (MAIN LOGIC)
async function addClient(req, res) {
  try {
    const { tailorId, phone, name, address, outfit, deliveryDate, email } = req.body;

    // 🔍 check existing customer
    let existing = await Customer.findOne({ phone });


let newClient = new TailorCustomer({
  tailorId,
  phone,
  email, // ✅ ADD THIS
  outfit,
  lastVisit: new Date().toLocaleDateString(),
  measurements: {},
  deliveryDate,
  status: "Pending"
});

    if (existing) {

if (!phone) {
  return res.status(400).json({ error: "Phone required" });
}

      // 🟢 OLD CUSTOMER
      newClient.customerId = existing._id;
      newClient.name = existing.name;
      newClient.address = existing.address?.city;
      newClient.email = existing.email;
    } else {
      // 🔴 NEW CUSTOMER
      newClient.name = name;
      newClient.address = address;
       newClient.email = email
    }

    await newClient.save();

    res.json({ status: true, data: newClient });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ GET ALL CLIENTS OF A TAILOR
async function getClients(req, res) {
  try {
    const { tailorId } = req.params;

    const clients = await TailorCustomer.find({ tailorId });

    res.json(clients);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ UPDATE MEASUREMENTS
async function updateMeasurements(req, res) {
  try {
    const { id, measurements } = req.body;

    const updated = await TailorCustomer.findByIdAndUpdate(
      id,
      { measurements },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ DELETE CLIENT
async function deleteClient(req, res) {
  try {
    const { id } = req.body;

    await TailorCustomer.findByIdAndDelete(id);

    res.json({ status: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

status: "Pending"




async function getCustomerOrders(req, res) {
  try {
    const { email } = req.params;

    const orders = await TailorCustomer.find({ email });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}




const sendMail = require("../config/mailer");

async function updateStatus(req, res) {
  try {
    const { id, status } = req.body;

    const order = await TailorCustomer.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    // 🔥 MAIL LOGIC
    if (status === "Ready" || status === "Delivered") {
      await sendMail(
        order.email, // ⚠️ ensure DB me email field ho
        `Order ${status} ✨`,
        `Hi ${order.name},

Your outfit (${order.outfit}) is ${status} 🎉

Thank you for trusting us ✂️`
      );
    }

    res.json({ success: true, order });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update status" });
  }
}




module.exports = {
  addClient,
  getClients,
  updateMeasurements,
  deleteClient,
  updateStatus,
  getCustomerOrders

};