const Revenue = require('../model/revenueModel');

const getRevenueSummary = async (req, res) => {
  try {
    const totalRevenue = await Revenue.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalOrders: {
            $sum: {
              $cond: [{ $eq: ["$sourceType", "Order"] }, 1, 0]
            }
          },
          totalAppointments: {
            $sum: {
              $cond: [{ $eq: ["$sourceType", "Appointment"] }, 1, 0]
            }
          },
          totalTransactions: {
            $sum: 1
          }
        }
      }
    ]);

    const summary = totalRevenue[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      totalAppointments: 0,
      totalTransactions: 0
    };

    const averageTransaction = summary.totalTransactions > 0
      ? summary.totalRevenue / summary.totalTransactions
      : 0;

    res.status(200).json({
      success: true,
      summary: {
        ...summary,
        averageTransaction
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue summary",
      error: error.message
    });
  }
};


const getTransactionList = async (req, res) => {
  try {
    const transactions = await Revenue.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      transactions
    }); 

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error: error.message
    });
  }
};

// const createRevenue = async (req, res) => {
//   const { sourceId, sourceType, amount } = req.body;

//   if (!sourceId || !sourceType || !amount) {
//     return res.status(400).json({
//       success: false,
//       message: "All fields are required"
//     });
//   }

//   try {
//     const newRevenue = new Revenue({
//       sourceId,
//       sourceType,
//       amount
//     });

//     await newRevenue.save();

//     res.status(201).json({
//       success: true,
//       message: "Revenue added successfully"
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to add revenue",
//       error: error.message
//     });
//   }
// };

module.exports = { 
  getRevenueSummary,
  getTransactionList,
  // createRevenue
};
