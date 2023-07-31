import { TechnologyStack } from "./technology-stack";

export class Batch {

    pbatchId:number | undefined;
	batchName:string |undefined;
	 batchStartDate:Date | undefined;
	batchEndDate:Date | undefined;
	
	public  technologyStack:TechnologyStack | undefined;
	
	isDeleted=false;
	
}