import { Time } from "@angular/common";
import { TechnologyStack } from "./technology-stack";

export class Batch {

	batchStartDate:Date | undefined;
    batchId:number = 0;
	batchTiming:any ;
	batchName:string = '';
	batchDetails:string = '';
	technologyStack:TechnologyStack | undefined;
	isDeleted = false;
	isActive = true;
	
}