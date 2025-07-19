import { jwtDecode } from "jwt-decode"
interface JwtPayloadResult {
    email: string
    exp: number
    iat: number
    role: string
    sub: string
    username: string
}

const extractToken = (token:string): JwtPayloadResult => {
    const decode:JwtPayloadResult = jwtDecode(token)
    return decode;
}

export default extractToken;