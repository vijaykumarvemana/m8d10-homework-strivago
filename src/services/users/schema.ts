import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { ObjectId } from "bson";
const { Schema, model } = mongoose;



interface User {
  email: {unique: true, type: String}
  password: string,
  role: string,
  accessToken: string
}

interface UserModel extends mongoose.Model<User> {
  checkIfExists: (email: string) => Promise<boolean>;
  checkCredentials: (email: string, plainpassword: string) => Promise<User>;
  toJSON(): User;
  
}


const userSchema = new Schema<User , UserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: [true, "Such email already exists"],
    },
    password: { type: String },
    role: { type: String, default: "Guest", enum: ["Guest", "Host"] },
    accessToken: { type: String },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  const user = this;
  const plainpassword = user.password;
  console.log("coming from schema", plainpassword);
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(plainpassword, 10);
    console.log(user.password);
  }
  next();
});

interface Thing {
  prop: string | ObjectId | number;
}



userSchema.methods.toJSON = function f(x: Thing){
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.__v;
  delete userObject.accessToken;

  return userObject;
};

userSchema.statics.checkIfExists = async function (email) {
  const user = await this.findOne({ email });
  if (user) {
    console.log("user already exists");
    return true;
  } else {
    console.log("new user");
    return false;
  }
};
userSchema.statics.checkCredentials = async function(email, plainpassword) {
  const user = await this.findOne({ email });

  if (user) {
    console.log("user find:", user);

    const isMatch = await bcrypt.compare(plainpassword, user.password);

    if (isMatch) return user;
    else return null;
  } else return null;
};

// userSchema.statics.checkResetCredentials = async function(email){
//     const user = await this.findOne({email: email});

//     if(user){

//     }
// }

export default model<User, UserModel>("user", userSchema);
