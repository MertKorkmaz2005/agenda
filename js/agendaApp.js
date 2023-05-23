class AgendaApp{
    api;
   switcher;
   month = 0;
   //standaard begint de app bij 0
    constructor(){
        this.api = new API()
        //relatie tussen api en de agenda app
        this.switcher = new Switcher(this);
        //relatie tussen agendaApp en switcher
        this.api.getData().then(result => {
            this.switcher.loadAgenda(result[this.month])
        });
        //hier geeft je api terug en je kan er dan gebruik van maken

       
    }
    //deze agenda app zorgt voor alle functanaliteiten hiermee geef je de data door en alle classen gaan door de agenda app zie dit als een vader en de andere de kinderen.

    switchMonths = (sign) =>{
        switch(sign){
        case "+":
            this.month = this.month + 1;
            break;
            //hier wordt +1 bijgeteld waardoor je door de maanden heen klikt
        case "-":
            this.month = this.month - 1;
            break;
            //hier wordt -1 afgeteld waardoor je door de maanden heen klikt

            
        }

        // je zorgt ervoor dat als je klikt naar een andere maand dat er + 1 bij komt bij de DATA dat betekent dat je ophooght in de data.json
        //dit wordt ook andersom gedaan met de -


        if(this.month === 12){
            this.month = 0;
        }
        //deze zorgt ervoor dat als je bij de 12 regel bent in json dat je weer terug komt bij 0 zodat je door kunt klikken
        if(this.month < 0){
            this.month = 11;
        }
        //hier zeg je als je na 12 maande bent refresh en doe dit ook andersom
        this.switcher.loadAgenda(this.api.dataFromAPI[this.month])
    }
    

}

class API{
    dataFromAPI = [];
    // een simpele aray
    async getData(){
        await fetch("../data/data.json").then(response =>{
            return response.json()
        }).then(data => {
            this.dataFromAPI = data.months;
        });
        return this.dataFromAPI;
    }
}
//je pakt in de class alle data dit krijg je in een response en hier gebruik je ook return en async voor want anders gaat het te snel en herkent hij de data niet

class Agenda{
    renderer;
    header;
    month;
    htmlElement;
    agendaApp;

    constructor(data, agendaApp){
        // deze regel boven heeft relatie met de switcher class
        this.agendaApp = agendaApp;
        //hier zet je wat je meer krijgt in een variabele
        this.htmlElement = document.createElement("article");
        //je maakt een article
        this.htmlElement.classList.add("agenda");
        //je maakt een class agenda
        this.data = data
        //je zorgt ervoor dat je identificeert in een variabele wat je meekrijgt
        this.renderer = new Renderer();
        //met deze regel maak je een relatie met de renderer
        this.renderer.render("body",this.htmlElement);
        //je zegt hier waar en wat je wil renderen
        this.header = new Header(this,data.name, agendaApp);
        //hier geef je de header ierts mee agenda > header
        this.month = new Month(this, data.days);
        //hier geef je de maand iets mee agenda > month
    }

    render(placeToRender, whatToRender){
        this.renderer.render(placeToRender, whatToRender)
    }

}
//dit is de agenda de article de hoofd van alle elementen // html bedoel ik daarmee // hier zorg je ervoor dat je de link zet met de header month de month krijgt toch de dagen binnen dus het maakt niet uit en zo maak je gebruik van relaties
//voor de rest neem je data op en bij het renderen geef je aan waar je wil renderen en wat je wil renderen







class Header{
    nameOfMonth;
    htmlElement;
    agenda;
    leftButton
    rightButton
    constructor(agenda, nameOfMonth, agendaApp){
        this.agenda = agenda
        //kijk wat je binnenkrijgt object
        this.agendaApp = agendaApp
        //wat krijg je binnen namelijk object
        this.nameOfMonth = nameOfMonth;
        //data van anme of the month
        this.htmlElement = document.createElement("header");
        //maak een header
        this.htmlElement.classList.add("agenda__header");
        //geef een class
        this.text = document.createElement("h2");
        // maak een h2
        this.agenda.render(".agenda",this.htmlElement);
        //waar en wat wil je renderen 
        this.leftButton = new Button("previous","<", "agenda--left",this,this.agendaApp);
        //left pijl
        this.agenda.render(".agenda__header",this.text);
        //render daarna de text
        this.rightButton = new Button("next",">", "agenda--right",this,this.agendaApp);
        //right pijl
        this.text.innerText = this.nameOfMonth
        // de text geef je data.name


   // de header bestaat uit een name of month en uit pijltjes waar je op kunt drukken deze zijn zorgen ervoor dat je naar de volgende kan of terug kan
   //de name of month komt uit de data 


    }

    render(placeToRender, whatToRender){
        this.agenda.render(placeToRender,whatToRender);
    }
    //hier maak je een render functie

}



class Button{
    htmlElement;
    innerText;
    extraClass;
    switcher;
    header;
    type;
    constructor(type,innerText, extraClass, header, agendaApp){
        //button heeft een relatie met de header 
        this.type = type
        //previous of next
        this.agendaApp = agendaApp
        //de agenda app relatie
        this.htmlElement = document.createElement("button");
        // maak een button
        this.htmlElement.classList.add("agenda__button");
        //class megeve
        this.extraClass = extraClass
        //bv --left of --right
        this.htmlElement.classList.add(this.extraClass)
        //eze voeg je erbij via deze regel // dat identeficeert of het de rechter of de linker pijl is
        this.innerText = innerText;
        // > of <
        this.htmlElement.innerText = this.innerText;
        // this.switcher = new Switcher(this.extraClass);
        this.header = header;
        //header object
        this.render();
        //dit zorgt ervoor dat alles gerendered wordt                   VRAAG JEROEN

        this.htmlElement.onclick = this.buttonClicked
        //als je op het htmlElement clicked dan moet je de buttonclicked uitvoeren
    }


    buttonClicked = () => {
        if(this.type === "previous"){
            this.agendaApp.switchMonths("-")
            return;
        }
        this.agendaApp.switchMonths("+") 
        //deze zorgt voor het bij plussen of het aftrekken

    }

    render(){
        this.header.render("header", this.htmlElement)
        //hier zeg je wat je wil renderen in de header
    }
}

//met de button zorg je ervoor dat alles doorgeklikt wordt

class Switcher{
    AgendaApp;
    agenda;
    cleaner;
    constructor(agendaApp){
        this.agendaApp = agendaApp
        //realtie agendaapp
        this.cleaner = new Cleaner();
        //hier maak je relatie met de cleaner
        

    }

    loadAgenda = (data) =>{
        this.cleaner.clean("body")
        //dit zorgt ervoor dat er alleen een agenda wordt ingeladne
        this.agenda= new Agenda(data,this.agendaApp);
        //hier geef je dingen mee aan de agenda die gebruik ervan kan maken
    }

//door dit switch die maand

}
class Month{
    days = [];
    agenda;
    numberOfDays;
    htmlElement;

    constructor(agenda,numberOfDays){
        //de month krijgt dingen binnen
        this.htmlElement = document.createElement("ul")
        //maak ul
        this.htmlElement.classList.add("agenda__month")
        //geef een classen
        this.numberOfDays = numberOfDays
        // hier zet je het in een variabele
        this.agenda = agenda
        //hier zet je het in een variabele
        this.agenda.render(".agenda",this.htmlElement)
        //wat wil je renderen in de agenda
        for(let i = 0; i < numberOfDays; i++){
            this.days.push(new Day(this, i))
        }
        //for loop voor hoevaak een bolletje moet maken
       
        
    }

    renderDays(placeToRender,whatToRender){
        this.agenda.render(placeToRender, whatToRender)
        //hier geef je mee wat wil renderen

    }
    //hier maak je de lijst aan

}

class Day{
    month;
    htmlElement;
    dayNumber;
    constructor(month,dayNumber){
        //de day krijgt gegevens binnen
        this.dayNumber = dayNumber
        //je zet in een variabele
        this.htmlElement = document.createElement("li");
        // maak een bolletje aan
        this.htmlElement.classList.add("agenda__day")
        //geef een class
        this.htmlElement.innerText = this.dayNumber;
        // zet in de dagen de data wat je meekrijgt 
        this.month = month;
        //zet in variabele
        this.month.renderDays(".agenda__month", this.htmlElement)
        //je geeft dagen mee aan de ul

    }
    //hier worden de dagen aangemaakt


}






