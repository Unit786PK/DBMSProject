function App(){
    return{
        open: false,
        region: 0,
        countries: [],
        async getCountries(){
          const response = await fetch(`/api/countries`).then(res =>res.json());
          console.log(response);
          this.countries=response;
        },
        async Detail(regionId){
        console.log(regionId);
         const response = await fetch(`/api/regions/${regionId}`).then(res =>res.json());
          console.log(response);
          this.region = response;
        }
    }
}