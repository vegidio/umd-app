export namespace model {
	
	export class Media {
	    Url: string;
	    Extension: string;
	    Type: number;
	    Metadata: {[key: string]: any};
	
	    static createFrom(source: any = {}) {
	        return new Media(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Url = source["Url"];
	        this.Extension = source["Extension"];
	        this.Type = source["Type"];
	        this.Metadata = source["Metadata"];
	    }
	}

}

