import Product from '../models/Product.js'
import {v2 as cloudinary} from 'cloudinary'

//add product :api/product/add

export const addProduct = async (req, res) => {
  try {
    if (!req.body.productData) {
      return res.json({ success: false, message: "Product data is missing" });
    }

    let productData;
    try {
      productData = JSON.parse(req.body.productData);
    } catch (err) {
      return res.json({ success: false, message: "Invalid product JSON" });
    }

    const images = req.files || [];

    // Upload to cloudinary and get URLs
    const imageUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    await Product.create({ ...productData, image: imageUrl });

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


//api/product/list

export const productList = async (req, res) => {
       try {
         const products = await Product.find({});
         res.json({success: true , products})
       } catch (error) {
         console.log(error)
            res.json({success : false , message : error.message})
       }
}

//s-product:api/product/id

export const productById = async (req, res) => {
     try {
        const {id } = req.body
        const product = await Product.findById(id)
        res.json({success : true , product})
     } catch (error) {
        console.log(error);
        res.json({success : false , message : error.message})
     }
}

//chan :api/produt/stock

export const changeStock = async (req, res) => {
    try {
         const {id, inStock} = req.body
         await Product.findByIdAndUpdate(id,{inStock},{new : true})
         res.json({success : true , message : "Stock updated successfully"})
    } catch (error) {
        console.log(error)
        res.json({success : false , message : error.message})
    }
}