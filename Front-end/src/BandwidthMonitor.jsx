import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Legend,
  Tooltip
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Legend, Tooltip);

const BandwidthMonitor = () => {
  const [history, setHistory] = useState([]);
  const [selectedInterface, setSelectedInterface] = useState(1); // Estado para a interface selecionada
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval;
    let lastRxBytes = 0;
    let lastTxBytes = 0;

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/snmp/trafego/?rxPorta=${selectedInterface}&txPorta=${selectedInterface}`);
        const data = await response.json();
        const currentTime = new Date(data.time).toLocaleTimeString();

        const rxBytes = data.valores.rxBytes;
        const txBytes = data.valores.txBytes;

        const rxBps = lastRxBytes ? ((rxBytes - lastRxBytes) * 8) / 5 : 0;
        const txBps = lastTxBytes ? ((txBytes - lastTxBytes) * 8) / 5 : 0;

        lastRxBytes = rxBytes;
        lastTxBytes = txBytes;

        if (!isPaused) {
          setHistory(prev => [...prev.slice(-19), { timestamp: currentTime, rx: rxBps, tx: txBps }]);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
      }
    };

    if (!isPaused) {
      fetchData();
      interval = setInterval(fetchData, 5000);
    }

    return () => clearInterval(interval);
  }, [isPaused, selectedInterface]); // Adicionado selectedInterface como dependência

  const chartData = {
    labels: history.map(d => d.timestamp),
    datasets: [
      {
        label: 'Média Rx (bps)',
        data: history.map(d => d.rx),
        borderColor: 'green',
        fill: false
      },
      {
        label: 'Média Tx (bps)',
        data: history.map(d => d.tx),
        borderColor: 'blue',
        fill: false
      }
    ]
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>Mikrotik Bandwidth Monitor</h2>
      <p>
        IP/Hostname: <strong>192.168.18.65</strong> | ether: <strong>{selectedInterface}</strong>
      </p>
      <div style={{ border: '1px solid #ccc', padding: 10 }}>
        <Line data={chartData} />
      </div>

      <div style={{ marginTop: 20 }}>
        <label htmlFor="iface">Interface:</label>{' '}
        <select
          id="iface"
          value={selectedInterface}
          onChange={e => {
            setSelectedInterface(Number(e.target.value));
            setHistory([]);
          }}
        >
          <option value={1}>ether 1</option>
          <option value={2}>ether 2</option>
          <option value={3}>ether 3</option>
          <option value={4}>ether 4</option>
        </select>{' '}
        <button onClick={() => setIsPaused(p => !p)}>{isPaused ? 'Retomar' : 'Pausar'}</button>
      </div>

      <hr />
      <p>
        Status: <strong style={{ color: 'green' }}>Conectado</strong> <br />
        Última leitura: {history.length > 0 ? history[history.length - 1].timestamp : '---'}
      </p>
    </div>
  );
};

export default BandwidthMonitor;
