import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters long'],
      maxlength: [120, 'Product name cannot exceed 120 characters']
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [2, 'SKU must be at least 2 characters long'],
      maxlength: [60, 'SKU cannot exceed 60 characters']
    },
    category: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Category',
  required: [true, 'Category is required'],
},
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    image: {
  url: {
    type: String,
    default: '',
  },
  filename: {
    type: String,
    default: '',
  },
},
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: ''
    }
  },
  {
    timestamps: true
  }
);


const Product = mongoose.model('Product', productSchema);

export default Product;
