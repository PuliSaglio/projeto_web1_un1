document.addEventListener('DOMContentLoaded', function(){
    localStorage.removeItem('filtrosViagem');
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
        localStorage.removeItem('filtrosViagem');
        
        const dadosForm = coletarDadosForm();
        console.log(dadosForm);
        const erroForm = validarForm(dadosForm.origem, dadosForm.destino, dadosForm.passageiros);
        const erroDatas =validarDatas(dadosForm.dataIda, dadosForm.dataVolta);

        const filtrosViagem = {
            origem: dadosForm.origem,
            destino: dadosForm.destino,
            passageiros: dadosForm.passageiros,
            opcaoViagem: dadosForm.opcaoViagem,
            dataIda: dadosForm.dataIda,
            dataVolta: dadosForm.dataVolta
        };
        if(erroForm !== 1 && erroDatas !== 1){
            localStorage.setItem('filtrosViagem', JSON.stringify(filtrosViagem));
            window.location.href = 'voos.html';
        }

        
    })
})

function validarForm(origem, destino, passageiros){
    if(origem.toLowerCase() == destino.toLowerCase()){
        alert("A origem deve ser diferente do Destino.");
        return 1;
    }
    if(passageiros<=0){
        alert("O número de passageiros deve ser maior que 0");
        return 1;
    }
}

function validarDatas(dataIda, dataVolta){
    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);

    let [ano, mes, dia] = dataIda.split('-');
    const dataViagem = new Date(ano, mes - 1, dia);
    [ano, mes, dia] = dataVolta.split('-');
    const dataVoltaViagem = new Date(ano, mes - 1 , dia);

    if(dataViagem < dataAtual){
        alert("A data de viagem não pode ser no passado.");
        return 1;
    }else if(dataVoltaViagem < dataAtual){
        alert("A data de viagem não pode ser no passado.");
        return 1;
    }

    if(dataViagem > dataVoltaViagem){
        alert("A data de Volta tem que ser depois da Ida");
        return 1;
    }
}

function coletarDadosForm(){
    const origem = document.getElementById('origem').value;
    const destino = document.getElementById('destino').value;
    const passageiros = document.getElementById('passageiros').value;
    const opcaoViagem = document.getElementById('opcao-viagem').value;
    const dataIda = document.getElementById('data-viagem').value;
    const dataVolta = document.getElementById('data-volta').value;

    return{
        origem,
        destino,
        passageiros,
        opcaoViagem,
        dataIda,
        dataVolta
    }
}