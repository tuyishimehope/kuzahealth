import { jwtDecode } from "jwt-decode"

const extractToken = (token:string) => {
    const decode = jwtDecode(token)
    return decode;
}

export default extractToken;