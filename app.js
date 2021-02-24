class Despesa{
    constructor(an,mois,jour,typ,desc,valor){
        this.an = an;
        this.mois = mois;
        this.jour = jour;
        this.typ = typ;
        this.desc = desc;
        this.valor = valor;
    }

    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null)
                return false
        }
        return true;
    }
}

class Bd {

    constructor(){
        let id = localStorage.getItem('id');
        
        if(id === null){
            localStorage.setItem('id',0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    gravar(d){
        let id = this.getProximoId();
        
        localStorage.setItem(id,JSON.stringify(d));
        
        localStorage.setItem('id',id);
    }

    recuperarTodosRegistros(){
        let despesas = Array();
        let id = localStorage.getItem('id');

        for(let i = 1; i <= id; i++){
            let despesa = JSON.parse(localStorage.getItem(i));
            
            if(despesa === null){
                continue;
            }

            despesa.id = i;
            despesas.push(despesa);
        }
        
        return despesas;
    }

    pesquisar(despesa){
        let despesasFiltradas = Array();
        despesasFiltradas = this.recuperarTodosRegistros();
    
        //an
        if(despesa.an != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.an == despesa.an);
        }
           
        //mois
        if(despesa.mois != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mois == despesa.mois);
        }

        //jour
        if(despesa.jour != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.jour == despesa.jour);
        }

        //typ
        if(despesa.typ != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.typ == despesa.typ);
        }

        //desc
        if(despesa.desc != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.desc == despesa.desc);
        }

        //valor
        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
        }
        
        return despesasFiltradas;
    }

    remover(id){
        localStorage.removeItem(id);
    }

}

let bd = new Bd();

function cadastrarDespesa(){
    let an = document.getElementById('an');
    let mois = document.getElementById('mois');
    let jour = document.getElementById('jour');
    let typ = document.getElementById('typ');
    let desc = document.getElementById('desc');
    let valor = document.getElementById('valor');

    let despesa = new Despesa(an.value,mois.value,jour.value,typ.value,desc.value,valor.value);
    
    if(despesa.validarDados()){
        bd.gravar(despesa);

        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso';
        document.getElementById('modal_titulo_div').className = 'modal-header text-success';
        document.getElementById('modal_conteudo').innerHTML = 'Despesa cadastrada com sucesso.';
        document.getElementById('modal_btn').innerHTML = 'Voltar';
        document.getElementById('modal_btn').className = 'btn btn-success';    
       
        an.value = '';
        mois.value = '';
        jour.value = '';
        typ.value = '';
        desc.value = '';
        valor.value = '';
    } 
    else{
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão da despesa.';
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger';
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente.';
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir';
        document.getElementById('modal_btn').className = 'btn btn-danger';      
    }

    $('#modalRegistraDespesa').modal('show');
}

function carregarListaDespesas(despesas = Array(), filtro = false){
   
    if(despesas.length == 0 && !filtro){
        despesas = bd.recuperarTodosRegistros();
    }
    
    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';

    despesas.forEach(function(d){

       let linha = listaDespesas.insertRow();

        linha.insertCell(0).innerHTML = `${d.jour}/${d.mois}/${d.an}`;
       
        switch(d.typ){
            case '1': d.typ = 'Alimentação';
                break;
            case '2': d.typ = 'Educação';
                break;
            case '3': d.typ = 'Lazer';
                break;
            case '4': d.typ = 'Saúde';
                break;
            case '5': d.typ = 'Transporte';
                break;
        }

        linha.insertCell(1).innerHTML = d.typ;
        linha.insertCell(2).innerHTML = d.desc;
        linha.insertCell(3).innerHTML = d.valor;

        let btn = document.createElement("button");
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = `id_despesa_${d.id}`;
        linha.insertCell(4).append(btn);
        btn.onclick = function(){
            let id = this.id.replace('id_despesa_','');
           bd.remover(id);
           window.location.reload();
        }
    });
}

function pesquisarDespesa(){
    let ano = document.getElementById('an').value;
    let mois = document.getElementById('mois').value;
    let jour = document.getElementById('jour').value;
    let typ = document.getElementById('typ').value;
    let desc = document.getElementById('desc').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(an,mois,jour,typ,desc,valor);
    let despesas = bd.pesquisar(despesa);
    carregarListaDespesas(despesas,true);

}

