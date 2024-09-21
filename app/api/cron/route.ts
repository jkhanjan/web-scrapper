import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scrapper";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    connectToDB();

    const products = await Product.find({});
    if (!products) throw new Error("No product found");

    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapedProducts = await scrapeAmazonProduct(currentProduct.url);

        if (!scrapedProducts) throw new Error("No result found");

        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          { price: scrapedProducts.currentPrice },
        ];

        const product = {
          ...scrapedProducts,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        const updatedProduct = await Product.findOneAndUpdate(
          { url: scrapedProducts.url },
          product,
          { upsert: true, new: true }
        );

        const emailNotifyType = getEmailNotifType(
          scrapedProducts,
          currentProduct
        );

        if (emailNotifyType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };

          const emailContent = await generateEmailBody(
            productInfo,
            emailNotifyType
          );

          const userEmails = updatedProduct.users.map(
            (user: any) => user.email
          );

          await sendEmail(emailContent, userEmails);
        }

        return updatedProduct;
      })
    );
    return NextResponse.json({
      message: "Ok",
      data: updatedProducts,
    });
  } catch (error) {
    console.log(error);
  }
}
