import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema, model } = mongoose;

const userSchema = new Schema(
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

userSchema.methods.toJSON = function () {
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
userSchema.statics.checkCredentials = async function (email, plainpassword) {
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

export default model("user", userSchema);
