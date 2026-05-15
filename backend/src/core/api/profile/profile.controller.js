import { ProfileService } from '../../modules/profile/service/profile.service';
import { UpdateProfileDto, DeleteAccountDto, AddDevicesDto } from '../../modules/profile';
import { ValidHttpResponse } from '../../../packages/handler/response/validHttp.response';
import { getUserContext } from 'packages/authModel/module/user';

class Controller {
    constructor() {
        this.service = ProfileService;
    }

    getMyProfile = async req => {
        const userId = getUserContext(req).payload.id;
        const data = await this.service.getMyProfile(userId);
        return ValidHttpResponse.toOkResponse({
            status: 'success',
            message: 'Profile retrieved successfully',
            data,
        });
    };

    updateMyProfile = async req => {
        const userId = getUserContext(req).payload.id;
        const data = await this.service.updateMyProfile(userId, UpdateProfileDto(req.body));
        return ValidHttpResponse.toOkResponse({
            status: 'success',
            message: 'Cap nhat ho so thanh cong',
            data,
        });
    };

    deleteMyAccount = async req => {
        const userId = getUserContext(req).payload.id;
        const data = await this.service.deleteMyAccount(userId, DeleteAccountDto(req.body));
        return ValidHttpResponse.toOkResponse({
            status: 'success',
            message: data.message,
        });
    };

    addDevices = async req => {
        const userId = getUserContext(req).payload.id;
        const data = await this.service.addDevices(userId, AddDevicesDto(req.body));
        return ValidHttpResponse.toOkResponse({
            status: 'success',
            message: data.message,
        });
    };

    getAssistiveDevices = async req => {
        const data = await this.service.getAllAssistiveDevices();
        return ValidHttpResponse.toOkResponse({
            status: 'success',
            message: 'Danh sach thiet bi ho tro',
            data,
        });
    };
}

export const ProfileController = new Controller();
