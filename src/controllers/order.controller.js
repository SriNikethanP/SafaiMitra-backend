import Order from "../models/order.model.js";
import Upload from "../models/upload.model.js";
import cloudinary from "../lib/cloudinary.js";

export const upload = async (req, res) =>{
    try {
        const userId = req.user._id;
        const captainId = req.captain._id;
        const {uploadImage, location} = req.body;

        const uploadResponse = await cloudinary.uploader.upload(image)
        const image = await Upload.findOneAndUpdate(userId, {uploadImage:uploadResponse.secure_url},{new:true});

        const orderId = Math.floor(Math.random() * 10 ** 14);

        console.log(orderId);

        if(!uploadImage || !location){
            return res.status(400).json({message:"please enter all mandatory fields"})
        };


        //fetch location here


        const newUpload = new Upload({
            user: userId,
            captain:captainId,
            uploadImage:image,
            location:{
                lat:"", //replace with location.lat
                long:"" //replace with location.long
            },
            orderId
        });

        if(newUpload){
            await newUpload.save();
            res.status(201).json(newUpload);
        } else {
            res.status(400).json({error: "Invalid order data"}); 
        }
        
    } catch (error) {
        console.log("error in order", error.message)
        res.status(500).json({message:"Internal server error"});
    }
};


export const order = async (req, res) => {
    try {
        const userId = req.user._id;
        const captainId = req.captain._id;

        const {garbageType, selectedDate, location} = req.body;

        const orderId = Math.floor(Math.random() * 10 ** 14);

        console.log(orderId);

        if(!garbageType || !location){
            return res.status(404).json({message:"Please enter all mandatory fields"})
        };

        //fetch location here

        const newOrder = new Order({
            user: userId,
            captain:captainId,
            garbageType,
            selectedDate,
            location:{
                lat:"", //replace with the fetched location.lat
                long:""  //replace with the fetched location.long
            },
            orderId
        });

        await newOrder.save()

        res.status(200).json({message:"Order in Pending"})
    } catch (error) {
        console.log("error in ordering for garbage collector", error.message);
        res.status(500).json({message:"Internal Server Error"});
    };
}
