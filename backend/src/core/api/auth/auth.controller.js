import { AuthService } from '../../modules/auth/service/auth.service';
import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto } from '../../modules/auth';
import { ValidHttpResponse } from '../../../packages/handler/response/validHttp.response';
import { cookieOptions, ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_TTL_MS } from '../../config/auth.config';
import { UnAuthorizedException } from '../../../packages/httpException';

class Controller {
    constructor() {
        this.service = AuthService;
    }

    #setTokenCookies = (res, data) => {
        res.cookie('access_token', data.access_token, { ...cookieOptions, maxAge: ACCESS_TOKEN_MAX_AGE });
        res.cookie('refresh_token', data.refresh_token, { ...cookieOptions, maxAge: REFRESH_TOKEN_TTL_MS });
    };

    #clearTokenCookies = res => {
        res.clearCookie('access_token', cookieOptions);
        res.clearCookie('refresh_token', cookieOptions);
    };

    login = async (req, res) => {
        const data = await this.service.login(LoginDto(req.body));
        this.#setTokenCookies(res, data);
        return ValidHttpResponse.toOkResponse(data);
    };

    register = async (req, res) => {
        const data = await this.service.register(RegisterDto(req.body));
        this.#setTokenCookies(res, data);
        return ValidHttpResponse.toOkResponse(data);
    };

    refresh = async (req, res) => {
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) {
            throw new UnAuthorizedException('Refresh token is missing');
        }
        const data = await this.service.refresh({ refresh_token: refreshToken });
        this.#setTokenCookies(res, data);
        return ValidHttpResponse.toOkResponse(data);
    };

    forgotPassword = async req => {
        const data = await this.service.forgotPassword(ForgotPasswordDto(req.body));
        return ValidHttpResponse.toOkResponse(data);
    };

    resetPassword = async req => {
        const data = await this.service.resetPassword(ResetPasswordDto(req.body));
        return ValidHttpResponse.toOkResponse(data);
    };

    logout = async (req, res) => {
        const refreshToken = req.cookies?.refresh_token;
        if (!refreshToken) {
            throw new UnAuthorizedException('Refresh token is missing');
        }
        const data = await this.service.logout({ refresh_token: refreshToken });
        this.#clearTokenCookies(res);
        return ValidHttpResponse.toOkResponse(data);
    };
}

export const AuthController = new Controller();
