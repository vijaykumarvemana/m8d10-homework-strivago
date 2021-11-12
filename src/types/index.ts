interface User{
    email: {unique: true, type: String},
    password: string,
    role: string,
    accessToken: string,
    checkCredentials : (
        username: string,
        password: string
      ) => Promise< User | null>;
  }


 export interface accomodation {  
    name: string,
    description: string,
    host: User | string,
    maxGuests: number,
    city: string,
  }


export default User;
