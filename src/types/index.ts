interface User{
    email: {unique: true, type: String},
    password: string,
    role: string,
    accessToken: string
  }


 export interface accomodation {  
    name: string,
    description: string,
    host: User | string,
    maxGuests: number,
    city: string,
  }


export default User;
