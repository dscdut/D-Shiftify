import { DataRepository } from 'packages/restBuilder/core/dataHandler/data.repository';

class Repository extends DataRepository {
    baseSelect() {
        return [
            'cvs.id',
            'cvs.profile_id as profileId',
            'cvs.job_type as jobType',
            'cvs.work_mode as workMode',
            'cvs.mobility',
            'cvs.expected_job as expectedJob',
            'cvs.skills',
            'cvs.conditions',
            'cvs.experiences',
            'cvs.certificates',
            'cvs.custom_sections as customSections',
            'cvs.created_at as createdAt',
            'cvs.updated_at as updatedAt',
        ];
    }

    createCV(cvData) {
        return this.query()
            .insert(cvData)
            .returning(this.baseSelect());
    }

    findById(id) {
        return this.query()
            .innerJoin('profiles', 'profiles.id', 'cvs.profile_id')
            .innerJoin('users', 'users.id', 'profiles.user_id')
            .where('cvs.id', id)
            .whereNull('cvs.deleted_at')
            .select([
                ...this.baseSelect(),

                'profiles.full_name as fullName',
                'profiles.phone',
                'profiles.gender',
                'profiles.disability_status as disabilityStatus',

                'users.email',
            ])
            .first();
    }

    updateCV(id, cvData) {
        return this.query()
            .where('id', id)
            .whereNull('deleted_at')
            .update({
                ...cvData,
                updated_at: new Date(),
            })
            .returning(this.baseSelect());
    }
    
}

export const CVRepository = new Repository('cvs');