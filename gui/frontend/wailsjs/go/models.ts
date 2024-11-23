export namespace main {
	
	export class Download {
	    Url: string;
	    FilePath: string;
	    Error: any;
	    IsSuccess: boolean;
	    Hash: string;
	
	    static createFrom(source: any = {}) {
	        return new Download(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Url = source["Url"];
	        this.FilePath = source["FilePath"];
	        this.Error = source["Error"];
	        this.IsSuccess = source["IsSuccess"];
	        this.Hash = source["Hash"];
	    }
	}

}

export namespace model {
	
	export class Media {
	    Url: string;
	    Extension: string;
	    Type: number;
	    Extractor: number;
	    Metadata: {[key: string]: any};
	
	    static createFrom(source: any = {}) {
	        return new Media(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Url = source["Url"];
	        this.Extension = source["Extension"];
	        this.Type = source["Type"];
	        this.Extractor = source["Extractor"];
	        this.Metadata = source["Metadata"];
	    }
	}

}

