import { Pipe, PipeTransform} from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { log } from 'console';

@Pipe({ name: 'safe' })

export class SafePipe implements PipeTransform {

constructor(private sanitizer: DomSanitizer) { }
transform(url: string ) {
  if(url.includes("watch?v"))
url=  url.replace("watch?v=","embed/")
else if(url.includes("https://youtu.be")){
  // https://youtu.be/OPso7mi6r10?si=TmwUToqcLQsivrth
  // https://youtube.com/embed/OPso7mi6r10
   let index= url.indexOf("?");
  index--;
  let id=""
      while(url.charAt(index)!='/' && index>14){
               id = url.charAt(index) + id;
               index--;
            //   console.log(id);
               
      }
      console.log(id);
      url="https://youtube.com/embed/"+id;
}
//url="https://youtube.com/embed/OPso7mi6r10";
 return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }        
}     