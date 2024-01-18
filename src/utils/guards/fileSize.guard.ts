import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class FileSizeGuard implements CanActivate {
  constructor(private readonly maxTotalSize: number) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const files = req.files;

    if (files) {
      const file = files[0] as Express.Multer.File;
      const size = file.size;

      return size > this.maxTotalSize;
    }

    return true;
  }
}
