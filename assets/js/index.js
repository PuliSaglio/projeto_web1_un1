function validarForm(){
    const origem = document.getElementById('origem').value;
    const destino = document.getElementById('destino').value;
    const passageiros = document.getElementById('passageiros').value;

    if(origem.toLowerCase() == destino.toLowerCase()){
        alert("A origem deve ser diferente do Destino.");
    }
    if(passageiros<=0){
        alert("O número de passageiros deve ser maior que 0");
    }
    validarDatas();
}

function validarDatas(){
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);

    const opcaoViagem = document.getElementById('opcao-viagem').value;
    let [ano, mes, dia] = document.getElementById('data-viagem').value.split('-');
    const dataViagem = new Date(ano, mes - 1, dia);
    [ano, mes, dia] = document.getElementById('data-volta').value.split('-');
    const dataVoltaViagem = new Date(ano, mes - 1 , dia);

    if(dataViagem < dataAtual){
        alert("A data de viagem não pode ser no passado.");
    }else if(dataVoltaViagem < dataAtual){
        alert("A data de viagem não pode ser no passado.");
    }

    if(dataViagem > dataVoltaViagem){
        alert("A data de Volta tem que ser depois da Ida");
    }
}

document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('form');
    const selectTipoViagem = document.getElementById('opcao-viagem');
    const dataVoltaViagem = document.getElementById('data-volta');

    
    
    selectTipoViagem.addEventListener('change' , function(){
        if(selectTipoViagem.value == "Ida e Volta"){
            dataVoltaViagem.style.display = 'block';
            dataVoltaViagem.required = true;
        }else {
            dataVoltaViagem.style.display = 'none';
            dataVoltaViagem.required = false;
            dataVoltaViagem.value = '';
        }
    });

    form.addEventListener('submit', function(event){
        event.preventDefault();
        validarForm();
    })
})