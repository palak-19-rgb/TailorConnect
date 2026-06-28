const TailorCustomer = require("../models/TailorCustomer");
const Customer = require("../models/Customer");

// ✅ ADD CLIENT (MAIN LOGIC)
async function addClient(req, res) {
  try {
    const { tailorId, phone, name, address, outfit, deliveryDate, email } = req.body;

    if (!phone) {                                              // ✅ check upar le aaya
      return res.status(400).json({ error: "Phone required" });
    }

    // 🔍 check existing customer
    let existing = await Customer.findOne({ phone });

    let newClient = new TailorCustomer({
      tailorId,
      phone,
      email,
      outfit,
      lastVisit: new Date().toLocaleDateString(),
      measurements: {},
      deliveryDate,
      status: "Pending"
    });

    if (existing) {
      // 🟢 OLD CUSTOMER
      newClient.customerId = existing._id;
      newClient.name = existing.name;
      newClient.address = existing.address?.city;
      newClient.email = existing.email;
    } else {
      // 🔴 NEW CUSTOMER
      newClient.name = name;
      newClient.address = address;
      newClient.email = email;
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
    order.email,
    `Order ${status} ✨`,
    order                                                   // ✅ pura object bhejo
  );
}


    res.json({ success: true, order });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update status" });
  }
}

async function getAnalytics(req, res) {
  try {
    const { tailorId } = req.params;
    const orders = await TailorCustomer.find({ tailorId });

    const totalOrders = orders.length;
    const delivered = orders.filter(o => o.status === "Delivered").length;
    const pending = orders.filter(o => o.status !== "Delivered").length;

    // outfit type count
    const outfitCount = {};
    orders.forEach(o => {
      if (o.outfit) {
        outfitCount[o.outfit] = (outfitCount[o.outfit] || 0) + 1;
      }
    });

    const sortedOutfits = Object.entries(outfitCount).sort((a, b) => b[1] - a[1]);
    const topOutfit = sortedOutfits[0]?.[0] || "N/A";

    // this month orders
    const now = new Date();
    const thisMonthOrders = orders.filter(o => {
      const d = new Date(o.lastVisit || o.deliveryDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    res.json({
      totalOrders,
      delivered,
      pending,
      topOutfit,
      thisMonthCount: thisMonthOrders.length,
      outfitBreakdown: outfitCount
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = {
  addClient,
  getClients,
  updateMeasurements,
  deleteClient,
  updateStatus,
  getCustomerOrders,getAnalytics

};