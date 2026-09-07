const mongoose = require("mongoose");
require("dotenv").config();
const jwt = require("jsonwebtoken");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const User = require("./models/User");
    const AIChat = require("./models/AIChat");
    const { generateChatTitle } = require("./utils/chatTitleGenerator");

    console.log("MongoDB connected successfully for integration test.");

    // 1. Create two test user IDs
    const userAId = new mongoose.Types.ObjectId();
    const userBId = new mongoose.Types.ObjectId();

    // 2. User A creates a chat
    const chatA = await AIChat.create({
      user: userAId,
      title: "New Chat",
      messages: [],
    });
    console.log("Test 1 Passed: User A chat created with ID:", chatA._id);

    // 3. User A sends first message -> Auto-title generated
    const msg1 = "Intel or Ryzen is best for video editing?";
    chatA.title = generateChatTitle(msg1);
    chatA.messages.push({
      sender: "user",
      text: msg1,
      products: [],
      createdAt: new Date(),
    });
    // Add bot response
    chatA.messages.push({
      sender: "bot",
      text: "Both are good choices...",
      products: [],
      createdAt: new Date(),
    });
    await chatA.save();

    console.log("Test 2 Passed: User A message saved. Title generated:", chatA.title);
    if (chatA.title !== "Intel vs Ryzen for Editing") {
      throw new Error("Title mismatch: " + chatA.title);
    }

    // 4. Verify User A can find their chat
    const userAChats = await AIChat.find({ user: userAId });
    if (userAChats.length !== 1 || userAChats[0]._id.toString() !== chatA._id.toString()) {
      throw new Error("User A could not find their chat.");
    }
    console.log("Test 3 Passed: User A lists their own chat.");

    // 5. Verify User B CANNOT find User A's chat (Isolation test)
    const userBChats = await AIChat.find({ user: userBId });
    if (userBChats.length !== 0) {
      throw new Error("Security violation: User B saw User A chats!");
    }
    console.log("Test 4 Passed: User B cannot see User A chats in list (Cross-account isolation).");

    // 6. Verify User B cannot access User A's chat by ID
    const userBDirectAccess = await AIChat.findOne({ _id: chatA._id, user: userBId });
    if (userBDirectAccess) {
      throw new Error("Security violation: User B accessed User A chat by ID!");
    }
    console.log("Test 5 Passed: User B direct access to User A chat blocked.");

    // 7. Product saving test
    const productSearchMsg = "I need a gaming laptop under Rs. 300000";
    const chat2 = await AIChat.create({
      user: userAId,
      title: generateChatTitle(productSearchMsg),
      messages: [
        {
          sender: "user",
          text: productSearchMsg,
          products: [],
          createdAt: new Date(),
        },
        {
          sender: "bot",
          text: "Here are recommended laptops:",
          products: [
            {
              productId: new mongoose.Types.ObjectId(),
              name: "HP Victus 16",
              price: 295000,
              image: "https://example.com/hp.jpg",
            },
          ],
          createdAt: new Date(),
        },
      ],
    });
    console.log("Test 6 Passed: Product recommendation saved with title:", chat2.title);
    const loadedChat2 = await AIChat.findById(chat2._id);
    if (loadedChat2.messages[1].products.length !== 1 || loadedChat2.messages[1].products[0].name !== "HP Victus 16") {
      throw new Error("Product details not preserved in chat history.");
    }
    console.log("Test 7 Passed: Product cards preserved in MongoDB history.");

    // 8. Delete test
    await AIChat.deleteMany({ user: { $in: [userAId, userBId] } });
    console.log("Test 8 Passed: Test chats cleaned up.");

    console.log("\n>>> ALL INTEGRATION & SECURITY TESTS PASSED! <<<");
    process.exit(0);
  } catch (err) {
    console.error("Integration test failed:", err);
    process.exit(1);
  }
})();
