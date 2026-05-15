import { ProfileRepository } from '../repository/profile.repository';
import { DeviceRepository } from '../repository/device.repository';
import { UserRepository } from '../../user/user.repository';
import { BcryptService } from '../../auth/service/bcrypt.service';
import connection, { getTransaction } from 'core/database';
import {
    NotFoundException,
    UnAuthorizedException,
    BadRequestException,
} from '../../../../packages/httpException';

class Service {
    constructor() {
        this.profileRepository = ProfileRepository;
        this.deviceRepository = DeviceRepository;
        this.userRepository = UserRepository;
        this.bcryptService = BcryptService;
    }

    async getMyProfile(userId) {
        const profile = await this.profileRepository.findByUserId(userId);
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        const devices = await this.deviceRepository.findByProfileId(profile.id);

        return {
            id: profile.id,
            full_name: profile.full_name,
            dob: profile.dob,
            gender: profile.gender,
            phone: profile.phone,
            disability_status: profile.disability_status,
            created_at: profile.created_at,
            devices,
        };
    }

    async updateMyProfile(userId, updateDto) {
        const profile = await this.profileRepository.findByUserId(userId);
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        const { device_ids, ...profileData } = updateDto;

        const cleanProfileData = {};
        Object.keys(profileData).forEach(key => {
            if (profileData[key] !== undefined) {
                cleanProfileData[key] = profileData[key];
            }
        });

        if (device_ids !== undefined) {
            if (device_ids.length > 0) {
                const existingDevices = await this.deviceRepository.findByIds(device_ids);
                if (existingDevices.length !== device_ids.length) {
                    throw new BadRequestException('One or more device_ids are invalid');
                }
            }

            const trx = await getTransaction();
            try {
                if (Object.keys(cleanProfileData).length > 0) {
                    await this.profileRepository.updateByUserId(userId, cleanProfileData, trx);
                }
                await this.deviceRepository.removeAllDevicesFromProfile(profile.id, trx);
                if (device_ids.length > 0) {
                    await this.deviceRepository.addDevicesToProfile(profile.id, device_ids, trx);
                }
                await trx.commit();
            } catch (error) {
                await trx.rollback();
                throw error;
            }
        } else if (Object.keys(cleanProfileData).length > 0) {
            await this.profileRepository.updateByUserId(userId, cleanProfileData);
        }

        return this.getMyProfile(userId);
    }

    async deleteMyAccount(userId, deleteDto) {
        const userWithPassword = await connection('users')
            .where('id', userId)
            .whereNull('deleted_at')
            .select('id', 'password_hash')
            .first();

        if (!userWithPassword) {
            throw new NotFoundException('User not found');
        }

        if (!this.bcryptService.compare(deleteDto.password, userWithPassword.password_hash)) {
            throw new UnAuthorizedException('Password is incorrect');
        }

        const trx = await getTransaction();
        try {
            await connection('users')
                .where('id', userId)
                .update({ deleted_at: connection.fn.now() })
                .transacting(trx);

            await connection('profiles')
                .where('user_id', userId)
                .update({ deleted_at: connection.fn.now() })
                .transacting(trx);

            await connection('refresh_tokens')
                .where('user_id', userId)
                .where('revoked', false)
                .update({ revoked: true })
                .transacting(trx);

            await trx.commit();
        } catch (error) {
            await trx.rollback();
            throw error;
        }

        return {
            message: 'Tai khoan cua ban da duoc vo hieu hoa.',
        };
    }

    async addDevices(userId, addDevicesDto) {
        const profile = await this.profileRepository.findByUserId(userId);
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        const existingDevices = await this.deviceRepository.findByIds(addDevicesDto.device_ids);
        if (existingDevices.length !== addDevicesDto.device_ids.length) {
            throw new BadRequestException('One or more device_ids are invalid');
        }

        const currentDevices = await this.deviceRepository.findByProfileId(profile.id);
        const currentDeviceIds = currentDevices.map(d => d.id);
        const newDeviceIds = addDevicesDto.device_ids.filter(id => !currentDeviceIds.includes(id));

        if (newDeviceIds.length > 0) {
            await this.deviceRepository.addDevicesToProfile(profile.id, newDeviceIds);
        }

        return {
            message: 'Add devices successfully',
        };
    }

    async getAllAssistiveDevices() {
        return this.deviceRepository.findAll();
    }
}

export const ProfileService = new Service();
