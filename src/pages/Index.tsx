import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: string;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer';
  amount: number;
  currency: string;
  price?: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

const Index = () => {
  const [balance, setBalance] = useState(100);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [orderType, setOrderType] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferAddress, setTransferAddress] = useState('');

  const cryptoPrices: CryptoPrice[] = [
    { symbol: 'BTC', name: 'Bitcoin', price: 43250.50, change: 2.34, volume: '1.2B' },
    { symbol: 'ETH', name: 'Ethereum', price: 2650.75, change: -1.45, volume: '850M' },
    { symbol: 'USDT', name: 'Tether', price: 1.00, change: 0.01, volume: '2.1B' },
    { symbol: 'BNB', name: 'BNB', price: 315.25, change: 3.12, volume: '320M' },
    { symbol: 'ADA', name: 'Cardano', price: 0.485, change: 1.87, volume: '180M' },
  ];

  const transactions: Transaction[] = [
    { id: '1', type: 'buy', amount: 0.00231, currency: 'BTC', price: 43200, timestamp: '2025-01-14 10:30', status: 'completed' },
    { id: '2', type: 'sell', amount: 1.5, currency: 'ETH', price: 2640, timestamp: '2025-01-14 09:15', status: 'completed' },
    { id: '3', type: 'transfer', amount: 50, currency: 'USDT', timestamp: '2025-01-14 08:45', status: 'pending' },
  ];

  const handleTrade = () => {
    const tradeAmount = parseFloat(amount);
    const tradePrice = parseFloat(price);
    
    if (orderType === 'buy') {
      const cost = tradeAmount * tradePrice;
      if (cost <= balance) {
        setBalance(balance - cost);
        alert(`Куплено ${tradeAmount} ${selectedCrypto} за $${cost.toFixed(2)}`);
      } else {
        alert('Недостаточно средств');
      }
    } else {
      const revenue = tradeAmount * tradePrice;
      setBalance(balance + revenue);
      alert(`Продано ${tradeAmount} ${selectedCrypto} за $${revenue.toFixed(2)}`);
    }
    
    setAmount('');
    setPrice('');
  };

  const handleTransfer = () => {
    const transferValue = parseFloat(transferAmount);
    if (transferValue <= balance && transferValue > 0) {
      setBalance(balance - transferValue);
      alert(`Переведено $${transferValue} на адрес: ${transferAddress}`);
      setTransferAmount('');
      setTransferAddress('');
    } else {
      alert('Недостаточно средств или некорректная сумма');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Icon name="TrendingUp" className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">CryptoExchange</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Баланс: ${balance.toFixed(2)}
              </Badge>
              <Button variant="outline" size="sm">
                <Icon name="User" className="h-4 w-4 mr-2" />
                Профиль
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trading Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="BarChart3" className="h-5 w-5 mr-2" />
                  Торговая панель
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="spot" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="spot">Спот торговля</TabsTrigger>
                    <TabsTrigger value="futures">Фьючерсы</TabsTrigger>
                  </TabsList>
                  <TabsContent value="spot" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="crypto-select">Выберите криптовалюту</Label>
                          <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {cryptoPrices.map((crypto) => (
                                <SelectItem key={crypto.symbol} value={crypto.symbol}>
                                  {crypto.symbol} - ${crypto.price.toLocaleString()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="order-type">Тип ордера</Label>
                          <Select value={orderType} onValueChange={setOrderType}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="buy">Купить</SelectItem>
                              <SelectItem value="sell">Продать</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="amount">Количество</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="price">Цена за единицу</Label>
                          <Input
                            id="price"
                            type="number"
                            placeholder="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                          />
                        </div>
                        
                        <Button 
                          onClick={handleTrade}
                          className={`w-full ${
                            orderType === 'buy' 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          {orderType === 'buy' ? 'Купить' : 'Продать'} {selectedCrypto}
                        </Button>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-semibold">Информация о сделке</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Общая стоимость:</span>
                            <span>${(parseFloat(amount || '0') * parseFloat(price || '0')).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Комиссия (0.1%):</span>
                            <span>${((parseFloat(amount || '0') * parseFloat(price || '0')) * 0.001).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span>Итого:</span>
                            <span>${((parseFloat(amount || '0') * parseFloat(price || '0')) * 1.001).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="futures">
                    <div className="text-center py-8">
                      <Icon name="Construction" className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">Фьючерсная торговля будет доступна в ближайшее время</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Balance & Transfer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="Wallet" className="h-5 w-5 mr-2" />
                  Баланс и переводы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">${balance.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Доступно для торговли</p>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Icon name="Send" className="h-4 w-4 mr-2" />
                      Перевести средства
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Перевод средств</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="transfer-amount">Сумма перевода</Label>
                        <Input
                          id="transfer-amount"
                          type="number"
                          placeholder="0.00"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="transfer-address">Адрес получателя</Label>
                        <Input
                          id="transfer-address"
                          placeholder="Введите адрес кошелька"
                          value={transferAddress}
                          onChange={(e) => setTransferAddress(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleTransfer} className="w-full">
                        Отправить перевод
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Market Prices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="TrendingUp" className="h-5 w-5 mr-2" />
                  Рыночные цены
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cryptoPrices.map((crypto) => (
                    <div key={crypto.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-semibold">{crypto.symbol}</div>
                        <div className="text-sm text-gray-500">{crypto.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${crypto.price.toLocaleString()}</div>
                        <div className={`text-sm ${crypto.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {crypto.change >= 0 ? '+' : ''}{crypto.change}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transactions History */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Icon name="History" className="h-5 w-5 mr-2" />
              История операций
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Тип</th>
                    <th className="text-left p-3">Валюта</th>
                    <th className="text-left p-3">Количество</th>
                    <th className="text-left p-3">Цена</th>
                    <th className="text-left p-3">Время</th>
                    <th className="text-left p-3">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b">
                      <td className="p-3">
                        <Badge variant={tx.type === 'buy' ? 'default' : tx.type === 'sell' ? 'destructive' : 'secondary'}>
                          {tx.type === 'buy' ? 'Покупка' : tx.type === 'sell' ? 'Продажа' : 'Перевод'}
                        </Badge>
                      </td>
                      <td className="p-3 font-semibold">{tx.currency}</td>
                      <td className="p-3">{tx.amount}</td>
                      <td className="p-3">{tx.price ? `$${tx.price.toLocaleString()}` : '-'}</td>
                      <td className="p-3">{tx.timestamp}</td>
                      <td className="p-3">
                        <Badge variant={tx.status === 'completed' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}>
                          {tx.status === 'completed' ? 'Завершено' : tx.status === 'pending' ? 'В обработке' : 'Ошибка'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;