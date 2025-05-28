document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
    localStorage.removeItem('filtrosHospedagem');

  const dadosForm = coletarDadosForm();

    if (!dadosForm.destino) {
      alert("Por favor, informe o destino.");
      return;
    }

    if (isNaN(dadosForm.numHospedes) || dadosForm.numHospedes < 1) {
      alert("Por favor, informe um número válido de hóspedes.");
      return;
    }

    if (!dadosForm.dataCheckin || !dadosForm.dataCheckout) {
      alert("Por favor, informe as datas de check-in e check-out.");
      return;
    }

    if (new Date(dadosForm.checkout) <= new Date(dadosForm.checkin)) {
      alert("A data de check-out deve ser posterior à data de check-in.");
      return;
    }

    const filtrosHospedagem = {
        destino: dadosForm.destino,
        numHospedes: dadosForm.numHospedes,
        dataCheckin: dadosForm.dataCheckin,
        dataCheckout: dadosForm.dataCheckout
    };
    localStorage.setItem('filtrosHospedagem', JSON.stringify(filtrosHospedagem));
    window.location.href = 'hospedagens.html';
  });

function coletarDadosForm(){
    const destino = document.getElementById('destino').value;
    const numHospedes = document.getElementById('num-hospedes').value;
    const dataCheckin = document.getElementById('data-checkin').value;
    const dataCheckout = document.getElementById('data-checkout').value;

    return{
        destino,
        numHospedes,
        dataCheckin,
        dataCheckout
    }
}

