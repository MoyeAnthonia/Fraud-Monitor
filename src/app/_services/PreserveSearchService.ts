import { Injectable } from "@angular/core";
// import { SearchResultsItem } from "app/_models/search";

interface PreservedSearchState {
    searchValue: string;
    results: any;
    resultsLength: number;
}

@Injectable({
    providedIn: "root",
})
export class PreserveSearchService {
    private lastSearch: PreservedSearchState;

    get searchState(): PreservedSearchState {
        return this.lastSearch;
    }

    set searchState(lastSearch: PreservedSearchState) {
        this.lastSearch = lastSearch;
    }

    constructor() {}
}