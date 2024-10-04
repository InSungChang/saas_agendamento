import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './AgendamentoModal.css';
import { formatDate, formatarDataHora, formatarData } from './Funcoes.js';
import { AuthContext } from '../AuthContext';
import { parseISO } from 'date-fns';

const AgendamentoModal = ({ show, onClose, selectedDate }) => {
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [diasExibicao, setDiasExibicao] = useState(1);
    const [clientes, setClientes] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [profissionais, setProfissionais] = useState([]);
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [agendamento, setAgendamento] = useState({
        cliente_id: '',
        servico_id: '',
        profissional_id: '',
        data: selectedDate,
        horarioInicial: '',
        horarioFinal: ''
    });
    const [horarioSelecionado, setHorarioSelecionado] = useState(null);
    const { empresa } = useContext(AuthContext);


    let formattedDate = formatDate(selectedDate); 
    console.log("Data do calendário: ", formattedDate);

    const ehHoje = (data) => {
      const hoje = new Date();
      const dataSelecionada = new Date(data);
      return dataSelecionada.toDateString() === hoje.toDateString();
    };

    const API_BASE_URL = process.env.REACT_APP_API_URL;

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    const ConfirmationModal = ({ onClose }) => (
      <div className="confirmation-modal">
          <div className="modal-content">
              <p>Agendamento realizado com sucesso!</p>
              <button onClick={onClose}>Fechar</button>
          </div>
      </div>
    );

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`${API_BASE_URL}/clientes`, { headers: { Authorization: `Bearer ${token}` } })
                .then(response => setClientes(response.data))
                .catch(error => console.error('Erro ao carregar clientes:', error));

            axios.get(`${API_BASE_URL}/servicos`, { headers: { Authorization: `Bearer ${token}` } })
                .then(response => setServicos(response.data))
                .catch(error => console.error('Erro ao carregar serviços:', error));
        }
    }, [API_BASE_URL]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAgendamento({ ...agendamento, [name]: value });
      
        if (name === 'servico_id') {
          carregarProfissionaisPorServico(value);
        }
      
        if (name === 'profissional_id') {
          carregarDisponibilidades(value, selectedDate); // Passe a data selecionada aqui
        }
      
        // Validar campos obrigatórios
        if (!agendamento.cliente_id || !agendamento.servico_id || !agendamento.profissional_id || !agendamento.data_horario_agendamento) {
          setMessage('Todos os campos são obrigatórios');
          setMessageType('error');
        } else {
          setMessage('');
          setMessageType('');
        }
    };      

    const carregarProfissionaisPorServico = (servicoId) => {
        const token = localStorage.getItem('token');
        axios.get(`${API_BASE_URL}/web/profissionais-por-servico/${servicoId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setProfissionais(response.data))
            .catch(error => console.error('Erro ao carregar profissionais por serviço:', error));
    };

    const carregarDisponibilidades = (profissionalId, selectedDate) => {
        const token = localStorage.getItem('token');
        const servicoDuracao = servicos.find(s => s.id === parseInt(agendamento.servico_id))?.duracao;
    
        axios.get(`${API_BASE_URL}/web/disponibilidades/profissional/${profissionalId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(response => {
            console.log('Dados recebidos:', response.data);
            console.log('diasExibicao:', diasExibicao);
            console.log('servicoDuracao:', servicoDuracao);
            // Obter o dia da semana de selectedDate
            const diaSemanaSelectedDate = new Date(selectedDate).getDay();

            const disponibilidadesFormatadas = formatarDisponibilidades(response.data, diaSemanaSelectedDate, servicoDuracao);
            console.log('Disponibilidades formatadas:', disponibilidadesFormatadas);
    
            // Filtrar disponibilidades baseado em agendamentos existentes
            axios.get(`${API_BASE_URL}/agendamentos/profissional/${profissionalId}`, {
              headers: { Authorization: `Bearer ${token}` }
            })
              .then(agendamentoResponse => {
                console.log('Retorno do backend1: ', agendamentoResponse.data);
                const agendamentosExistentes = agendamentoResponse.data;
                const disponibilidadesFiltradas = filtrarHorarios(disponibilidadesFormatadas, agendamentosExistentes);
                setDisponibilidades(disponibilidadesFiltradas);
                })
              .catch(error => {
                console.error('Erro ao carregar agendamentos:', error);
                setDisponibilidades([]);
                setMessage('Erro ao carregar agendamentos. Por favor, tente novamente.');
                setMessageType('error');
              });
          })
          .catch(error => {
            console.error('Erro ao carregar disponibilidades:', error);
            setDisponibilidades([]);
            setMessage('Erro ao carregar disponibilidades. Por favor, tente novamente.');
            setMessageType('error');
          });
    };
              
    const filtrarHorarios = (disponibilidades, agendamentos) => {
      const agora = new Date();
      
      return disponibilidades.map(dia => {
          /* const diaData = new Date(dia.data); */
          const diaData = parseISO(dia.data);
          const ehHoje = diaData.toDateString() === agora.toDateString();
          
          console.log("diaData",diaData);
          console.log("dia.data",dia.data);
          console.log("diaData.toDateString()", diaData.toDateString());
          console.log("agora.toDateString()", agora.toDateString());
          const horariosFiltrados = dia.horarios.filter(horario => {
              const horarioInicio = new Date(`${dia.data}T${horario.inicio}`);
              const horarioFim = new Date(`${dia.data}T${horario.fim}`);
              console.log("horarioFim",horarioFim);
              console.log("agora",agora);
              console.log("ehHoje",ehHoje);
              
              // Filtra horários passados apenas para o dia atual
              if (ehHoje && horarioFim <= agora) {
                  return false;
              }
              
              return true;
          }).map(horario => {
              const horarioInicio = new Date(`${dia.data}T${horario.inicio}`);
              const horarioFim = new Date(`${dia.data}T${horario.fim}`);
              
              const agendamentoConflito = agendamentos.find(ag => {
                  const agendamentoInicio = new Date(ag.data_horario_agendamento);
                  const agendamentoFim = new Date(ag.data_horario_agendamento);
                  agendamentoFim.setMinutes(agendamentoFim.getMinutes() + ag.servico_duracao);
                  
                  return (agendamentoInicio < horarioFim) && (agendamentoFim > horarioInicio);
              });
              
              return {
                  ...horario,
                  ocupado: Boolean(agendamentoConflito),
                  cliente_nome: agendamentoConflito ? agendamentoConflito.cliente_nome : null,
                  servico_nome: agendamentoConflito ? agendamentoConflito.servico_nome : null
              };
          });
          
          return {
              ...dia,
              horarios: horariosFiltrados
          };
      });
    };

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token && agendamento.profissional_id) {
          axios.get(`${API_BASE_URL}/agendamentos/profissional/${agendamento.profissional_id}`, {
              headers: { Authorization: `Bearer ${token}` }
          })
          .then(response => {
              const agendamentosExistentes = response.data;
              const disponibilidadesFiltradas = filtrarHorarios(disponibilidades, agendamentosExistentes);
              setDisponibilidades(disponibilidadesFiltradas);
          })
          .catch(error => {
              console.error('Erro ao carregar agendamentos:', error);
              setMessage('Erro ao carregar agendamentos. Por favor, tente novamente.');
              setMessageType('error');
          });
      }
    }, [agendamento.profissional_id, selectedDate]);

    const formatarDisponibilidades = (disponibilidades, diaSemanaSelectedDate, servicoDuracao) => {
        if (!disponibilidades || disponibilidades.length === 0) {
          return [];
        }
      
        const hoje = new Date();
        const disponibilidadesFormatadas = [];
        const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

        const diaSemana = diasSemana[diaSemanaSelectedDate];
      
        const disponibilidadesDoDia = disponibilidades.filter(d => d.dia_semana === diaSemana);

        if (disponibilidadesDoDia.length > 0) {
          const horariosDistribuidos = distribuirHorarios(disponibilidadesDoDia[0], servicoDuracao);
          const dataAtual = new Date();
          const dataFormatada = formatarData(dataAtual);
          disponibilidadesFormatadas.push({
              /* data: new Date().toISOString().split('T')[0], // Ajuste conforme necessário */
              data: dataFormatada,
              diaSemana: diaSemana,
              horarios: horariosDistribuidos
          });
        }

        /* for (let i = 0; i < dias; i++) {
            const data = new Date(hoje);
            data.setDate(hoje.getDate() + i);
            const diaSemana = diasSemana[data.getDay()];
      
            const disponibilidadesDoDia = disponibilidades.filter(d => d.dia_semana === diaSemana);
      
            if (disponibilidadesDoDia.length > 0) {
            const horariosDistribuidos = distribuirHorarios(disponibilidadesDoDia[0], servicoDuracao);
            
              disponibilidadesFormatadas.push({
                data: data.toISOString().split('T')[0],
                diaSemana: diaSemana,
                horarios: horariosDistribuidos
              });
            }
       } */
      
       return disponibilidadesFormatadas;
       
    };    

    const distribuirHorarios = (disponibilidade, servicoDuracao) => {
        const horarios = [];
        const inicio = new Date(`2000-01-01T${disponibilidade.hora_inicio}`);
        const fim = new Date(`2000-01-01T${disponibilidade.hora_fim}`);
      
        while (inicio < fim) {
          const horarioFim = new Date(inicio.getTime() + servicoDuracao * 60000);
          if (horarioFim <= fim) {
            horarios.push({
              inicio: inicio.toTimeString().slice(0, 5),
              fim: horarioFim.toTimeString().slice(0, 5)
            });
          }
          inicio.setTime(inicio.getTime() + servicoDuracao * 60000);
        }
      
        return horarios;
    };
    
    const handleHorarioClick = (inicio, fim) => {
        setAgendamento({ ...agendamento, horarioInicial: inicio, horarioFinal: fim });
        setHorarioSelecionado(inicio);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!agendamento.horarioInicial || !agendamento.horarioFinal) {
          setMessage('Por favor, selecione um horário.');
          setMessageType('error');
          return;
        }

        const dataHoraFormatada = formatarDataHora(formattedDate, agendamento.horarioInicial);

        console.log("dataHoraFormatada", dataHoraFormatada);

        // Criando o objeto agendamento com os dados necessários
        const novoAgendamento = {
          empresa_id: `${empresa.id}`, // Use optional chaining in case empresa is undefined
          cliente_id: agendamento.cliente_id,
          profissional_id: agendamento.profissional_id,
          servico_id: agendamento.servico_id,
          data_horario_agendamento: dataHoraFormatada,
          status: 'agendado'
        };

        console.log('Antes do erro: ', novoAgendamento);

        try {
          const token = localStorage.getItem('token');
          console.log('Dentro do try: ', novoAgendamento);
          const response = await axios.post(`${API_BASE_URL}/agendamentos`, novoAgendamento, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log(response.data);
          setMessage('Agendamento realizado com sucesso!');
          setMessageType('success');
          // Mostrar modal de confirmação
          setShowConfirmationModal(true);
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setMessage(error.response.data.message || 'Dados inválidos ou conflito de horário.');
            setMessageType('error');
          } else {
            console.error('Erro ao realizar agendamento:', error);
            setMessage('Erro ao realizar agendamento.');
            setMessageType('error');
          }
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className={`agendamentoModal ${show ? 'show' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>×</span>
                {message && <div className={`floating-message ${messageType}`}>{message}</div>}
                <form onSubmit={handleSubmit} className="agendamento-form">
                    <label>Data Selecionada</label>
                    <input type="text" value={formattedDate} readOnly />
                    <label>Cliente</label>
                    <select name="cliente_id" value={agendamento.cliente_id} onChange={handleChange} required>
                        <option value="">Selecione um cliente</option>
                        {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                        ))}
                    </select>
    
                    <label>Serviço</label>
                    <select name="servico_id" value={agendamento.servico_id} onChange={handleChange} required>
                        <option value="">Selecione um serviço</option>
                        {servicos.map(servico => (
                            <option key={servico.id} value={servico.id}>{servico.nome}</option>
                        ))}
                    </select>
    
                    <label>Profissional</label>
                    <select name="profissional_id" value={agendamento.profissional_id} onChange={handleChange} required>
                        <option value="">Selecione um profissional</option>
                        {profissionais.map(profissional => (
                            <option key={profissional.id} value={profissional.id}>{profissional.nome}</option>
                        ))}
                    </select>
    
                    <label>Horário Disponível</label>
                    {ehHoje(selectedDate) && (
                        <p className="info-message">
                            Horários anteriores ao momento atual não são exibidos.
                        </p>
                    )}
                    <div className="horario-grid">
                        {disponibilidades.length > 0 ? (
                            disponibilidades.map(dia => dia.horarios.map((horario, index) => (
                                <div 
                                    key={index}
                                    className={`horario ${horario.ocupado ? 'ocupado' : ''} ${horario.inicio === horarioSelecionado ? 'selecionado' : ''}`} 
                                    onClick={() => !horario.ocupado && handleHorarioClick(horario.inicio, horario.fim)}
                                >
                                    {horario.inicio} - {horario.fim}
                                </div>
                            )))
                        ) : (
                            <p>Não há horários disponíveis para o dia selecionado.</p>
                        )}
                    </div>   
                  <button type="submit" className="agendar-button">Agendar</button>
                  <button type="button" className="fechar-button" onClick={onClose}>Fechar</button>
                </form>
            </div>
            {showConfirmationModal && <ConfirmationModal onClose={() => setShowConfirmationModal(false)} />}
        </div>
    );
};

export default AgendamentoModal;
