import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { USER_MODEL } from '../database/database.constants';
import { RoleType } from '../shared/enum/role-type.enum';
import { User } from '../database/user.model';
import { Sex } from 'src/shared/enum/sex.enum';

@Injectable()
export class UserDataInitializerService implements OnModuleInit {
  constructor(@Inject(USER_MODEL) private userModel: Model<User>) {}

  async onModuleInit(): Promise<void> {
    console.log('(UserModule) is initialized...');
    await this.userModel.deleteMany({});
    const user = {
      username: 'hantsy',
      password: 'password',
      fullName: 'Hosni Mubarak',
      city: 'Moscow',
      sex: Sex.FEMALE,
      phone: '88005553535',
      avatar:
        'https://s3-alpha-sig.figma.com/img/d05d/8777/ffa8eb78ae526ec0234bfd0a5b9e2616?Expires=1616976000&Signature=Cy3vge-4MS4-H~48-DffPoc0j3vOhNfIfPfX7GJ1F0~V2XIfJp3-oS6iqf34LKPUIR9MywrNjUe08bEGsQb5uI3WhR7rK5B0h7GskojiyjbrrPG1nbHtZy36Vf12eBvrIeorZVHLcC95hz1oFXFr9PP95DTuWupe589V2AIo0I15~-A2DpRjjlhejXZT05emfWHpj~yGTJ2s8ifjNh3p0V1VsZOByk2E8DtWIGwwsxWFRs2R59~i8XBxpQDGuKEy~2-9GX83cpEIaOZ2zbIrZpia1BtOWBb~FDkHsm5MbAbch3Zq1IDhrpJyonMudYP~MmuT-IcSS0f2QdHpUo-U4w__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA',
      email: 'hantsy@example.com',
      roles: [RoleType.USER],
    };

    const admin = {
      username: 'admin',
      password: 'password',
      fullName: 'Tupoi Obmudok',
      city: 'Bagdad',
      sex: Sex.MALE,
      phone: '88005553535',
      avatar:
        'https://s3-alpha-sig.figma.com/img/e875/dd28/1f8725f5a5bc7ea4270e40603892b72c?Expires=1616976000&Signature=Yl2O-do7yOdTaPWp5s1oLOD30Vc76O4hOvyywUxeltBRLi2gO6a9ESjr-GZ5Jq1ymRgNTyDBw~Sr5D21bNqIGoGT6wzxkBqFCpMZLLJy5V4eGcCGni3jpiPW5eYJkIZNYk5h69FPgsWREyZwoB~HQoiooAUJJb7mHDshRWpvSo3Oj9kVYmz-q0l5WLw6ApTnp8w5wsVpJimWNeezmq4pVfLCrd~VBloF6huWVBhIO~KlGImVxUwuH~ZlM2OSvj~si0ikgBPAJrBx97FQL4Vacrs1-~KRl-Gt4UQkDIkxN~By2FnDeJ7CWuyb9aNdy8-M0QRL6WDarG-QcIgA0NGBGw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA',
      email: 'admin@example.com',
      roles: [RoleType.ADMIN],
    };
    await Promise.all([
      this.userModel.create(user),
      this.userModel.create(admin),
    ]).then((data) => console.log(data));
  }
}
