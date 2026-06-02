import { SetMetadata } from '@nestjs/common';

export const IS_ROLE = 'isRole';

export type RoleType = 'ADMIN' | 'STAFF' | 'USER';

export const Role = (roleType: RoleType) => SetMetadata(IS_ROLE, roleType);
