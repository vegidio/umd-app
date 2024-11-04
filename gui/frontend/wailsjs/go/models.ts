export namespace model {
	
	export class Media {
	    Url: string;
	    Metadata: {[key: string]: any};
	
	    static createFrom(source: any = {}) {
	        return new Media(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Url = source["Url"];
	        this.Metadata = source["Metadata"];
	    }
	}

}

