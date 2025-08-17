import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ipPipe'
})
export class IpPipePipe implements PipeTransform {

 transform(value: string): string {
    if (!value) return '';

    // Remove space
    let formattedIp = value.trim();

    //
    const parts = formattedIp.split('.');
    if (parts.length !== 4) {
      return 'Invalid IP';
    }

    return formattedIp;
  }

}
