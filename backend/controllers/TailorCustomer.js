const TailorCustomer = require("../models/TailorCustomer");
const Customer = require("../models/Customer");
const Tailor = require("../models/Tailor");

async function getAuthenticatedTailor(req, res) {
  if (req.user.role !== "Tailor") {
    res.status(403).json({ error: "Tailor access required" });
    return null;
  }

  const tailor = await Tailor.findOne({ email: req.user.email }).select("_id");
  if (!tailor) {
    res.status(403).json({ error: "Tailor account not found" });
    return null;
  }
  return tailor;
}

async function getOwnedClient(req, res, id) {
  const tailor = await getAuthenticatedTailor(req, res);
  if (!tailor) return null;

  const client = await TailorCustomer.findOne({ _id: id, tailorId: tailor._id });
  if (!client) {
    res.status(404).json({ error: "Client not found" });
    return null;
  }
  return client;
}

// ✅ ADD CLIENT (MAIN LOGIC)
async function addClient(req, res) {
  try {
    const { phone, name, address, outfit, deliveryDate, email } = req.body;
    const tailor = await getAuthenticatedTailor(req, res);
    if (!tailor) return;

    if (!phone) {                                              // ✅ check upar le aaya
      return res.status(400).json({ error: "Phone required" });
    }

    // 🔍 check existing customer
    let existing = await Customer.findOne({ phone });

    let newClient = new TailorCustomer({
      tailorId: tailor._id,
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
    const tailor = await getAuthenticatedTailor(req, res);
    if (!tailor) return;
    const { tailorId } = req.params;

    if (tailor._id.toString() !== tailorId) {
      return res.status(403).json({ error: "You can only view your own clients" });
    }

    const clients = await TailorCustomer.find({ tailorId: tailor._id });

    res.json(clients);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ UPDATE MEASUREMENTS
async function updateMeasurements(req, res) {
  try {
    const { id, measurements } = req.body;

    const client = await getOwnedClient(req, res, id);
    if (!client) return;
    const updated = await TailorCustomer.findByIdAndUpdate(
      client._id,
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

    const client = await getOwnedClient(req, res, id);
    if (!client) return;
    await TailorCustomer.findByIdAndDelete(client._id);

    res.json({ status: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}






async function getCustomerOrders(req, res) {
  try {
    const { email } = req.params;

    if (req.user.role !== "Customer" || req.user.email !== email) {
      return res.status(403).json({ error: "You can only view your own orders" });
    }

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
    const ownedOrder = await getOwnedClient(req, res, id);
    if (!ownedOrder) return;

    const order = await TailorCustomer.findByIdAndUpdate(
      ownedOrder._id,
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
    const tailor = await getAuthenticatedTailor(req, res);
    if (!tailor) return;
    const { tailorId } = req.params;
    if (tailor._id.toString() !== tailorId) {
      return res.status(403).json({ error: "You can only view your own analytics" });
    }
    const orders = await TailorCustomer.find({ tailorId: tailor._id });

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
