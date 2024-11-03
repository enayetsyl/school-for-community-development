import config from "../../config/index.js";
import { User } from "../module/User/user.model.js";

const superUser = {
  name: "Md Enayetur Rahman",
  email: "enayetflweb@gmail.com",
  password: config.super_user_password,
  role: 'superUser',
  isVerified: true
}


const seedSuperUser = async ()=>{
  const isSuperUserExist = await User.findOne({role: "superUser"})
  console.log('is super dmin exist', isSuperUserExist)
  if(!isSuperUserExist){
    await User.create(superUser)
  }
}

export default seedSuperUser