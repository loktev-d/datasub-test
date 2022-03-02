import Payment from "../schemas/payment-schema.js";

export async function createPayment(req, res, next) {
  try {
    const [month, year] = req.body.expirationDate.split("/");
    const doc = await new Payment({
      ...req.body,
      expirationDate: new Date(year, month, 1),
    }).save();

    res.json({ requestId: doc.id, amount: doc.amount });
  } catch (err) {
    next(err);
  }
}
