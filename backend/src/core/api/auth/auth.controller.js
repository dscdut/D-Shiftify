import { AuthService } from '../../modules/auth/service/auth.service';
import { LoginDto, RegisterDto, RefreshDto, ForgotPasswordDto, ResetPasswordDto, LogoutDto } from '../../modules/auth';
import { ValidHttpResponse } from '../../../packages/handler/response/validHttp.response';
import { NODE_ENV } from '../../env';

const cookieOptions = {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
};

const ACCESS_TOKEN_MAX_AGE = 24 * 60 * 60 * 1000; // 1 day
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

class Controller {
    constructor() {
        this.service = AuthService;
    }

    login = async (req, res) => {
        const data = await this.service.login(LoginDto(req.body));
        res.cookie('access_token', data.access_token, { ...cookieOptions, maxAge: ACCESS_TOKEN_MAX_AGE });
        res.cookie('refresh_token', data.refresh_token, { ...cookieOptions, maxAge: REFRESH_TOKEN_MAX_AGE });
        return ValidHttpResponse.toOkResponse(data);
    };

    register = async (req, res) => {
        const data = await this.service.register(RegisterDto(req.body));
        res.cookie('access_token', data.access_token, { ...cookieOptions, maxAge: ACCESS_TOKEN_MAX_AGE });
        res.cookie('refresh_token', data.refresh_token, { ...cookieOptions, maxAge: REFRESH_TOKEN_MAX_AGE });
        return ValidHttpResponse.toOkResponse(data);
    };

    refresh = async (req, res) => {
        const data = await this.service.refresh(RefreshDto(req.body));
        res.cookie('access_token', data.access_token, { ...cookieOptions, maxAge: ACCESS_TOKEN_MAX_AGE });
        res.cookie('refresh_token', data.refresh_token, { ...cookieOptions, maxAge: REFRESH_TOKEN_MAX_AGE });
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
        const data = await this.service.logout(LogoutDto(req.body));
        res.clearCookie('access_token', cookieOptions);
        res.clearCookie('refresh_token', cookieOptions);
        return ValidHttpResponse.toOkResponse(data);
    };
}

export const AuthController = new Controller();
