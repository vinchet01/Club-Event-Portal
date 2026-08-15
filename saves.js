module.exports = mongoose.model('Campground', CampgroundSchema);



const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String
});

