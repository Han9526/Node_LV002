const express = require("express");
const authMiddleware = require("../middlewares/need-signin.middlware");
const router = express.Router();
const { Products, Users } = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// CRUD

// C created

router.post("/product", authMiddleware, async (req, res) => {
  const { authorization } = req.headers;
  const [authType, authToken] = authorization.split(" ");
  const decodedJwt = jwt.verify(authToken, process.env.JWT_KEY);
  const { productName, productComments, price, productQuantity } = req.body;
  if (productName === "" || productComments === "" || price === null) {
    return res.status(400).json({ error: "값을 입력하시오" });
  }
  try {
    const createdProduct = await Products.create({
      productName,
      productComments,
      productQuantity,
      price,
      createdId: decodedJwt.userId,
    });
    res.json({ Product: createdProduct });
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});
// C created

// // R Read

// // 상품 목록 조회
router.get("/products", async (req, res) => {
  const productList = await Products.findAll({
    include: {
      model: Users,
      as: "User",
      attributes: ["name"],
    },
  });
  res.send({ List: productList });
});

// // 상품 detail 조회
// // 상품명, 작성 내용, 작성자명, 상품 상태, 작성 날짜 조회하기
router.get("/product/", (req, res) => {
  return res
    .status(400)
    .json({ message: "잘못된 접근입니다 ProductId를 입력하시오" });
});
router.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;
  const productDetail = await Products.findOne({
    where: {
      productId: productId,
    },
    include: {
      model: Users,
      as: "User",
      attributes: ["name"],
    },
  });
  res.status(200).json({ detail: productDetail });
});
// // R Read

// //  U Update
router.patch("/product/", authMiddleware, (req, res) => {
  return res.status(400).json({ message: "잘못된 접근입니다" });
});
router.patch("/product/:productId", async (req, res) => {
  const { productId } = req.params;
  const { authorization } = req.headers;
  const [, authToken] = authorization.split(" ");
  const decodedJwt = jwt.verify(authToken, process.env.JWT_KEY);
  const productDetail = await Products.findOne({
    where: {
      productId: productId,
    },
  });

  let { productName, productComments, productQuantity, price } = req.body;
  if (!productName && !productComments && !productQuantity && !price) {
    return res.status(400).json({ message: "값을 입력하시오" });
  }
  if (!productName) {
    productName = productDetail.productName;
  } else if (!productComments) {
    productComments = productDetail.productComments;
  } else if (!productQuantity) {
    productQuantity = productDetail.productQuantity;
  } else if (!price) {
    price = productDetail.price;
  }

  if (decodedJwt.userId === productDetail.createdId) {
    await Products.update(
      {
        productName: productName,
        productComments: productComments,
        productQuantity: productQuantity,
        price: price,
      },
      {
        where: {
          productId: productId,
        },
      }
    );
    res.status(200).json({ message: "수정 성공적" });
  } else {
    return res.status(401).json({ message: "수정 할 권한이 없습니다" });
  }
});
// //  U Update

// // D delete
// destroy()
router.delete("/product/", (req, res) => {
  return res.status(400).json({ message: "잘못된 접근입니다 " });
});
router.delete("/product/:productId", authMiddleware, async (req, res) => {
  const { productId } = req.params;
  const { authorization } = req.headers;
  const [, authToken] = authorization.split(" ");
  const decodedJwt = jwt.verify(authToken, process.env.JWT_KEY);
  const productDetail = await Products.findOne({
    where: {
      productId: productId,
    },
  });
  if(!productDetail){
    return res.status(401).json({message: "선택한 상품이 존재하지 않습니다"})
  }
  if (productDetail.createdId === decodedJwt.userId) {
    productDetail.destroy();
    return res.status(200).json({ message: "삭제가 성공적으로 이루어졌어" });
  } else {
    return res.status(401).json({ message: "삭제 할 권한이 없습니다" });
  }
});
// // D delete

module.exports = router;
