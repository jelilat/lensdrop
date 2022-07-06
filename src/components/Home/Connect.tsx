import {
  chain,
  useAccount,
  useConnect,
  useDisconnect
} from "wagmi";
global.Buffer = global.Buffer || require('buffer').Buffer;

export default function Connect() {
  const {
    address,
    connector, 
    isConnected,
    isConnecting,
    isReconnecting,
    isDisconnected } = useAccount();
  const { connect, connectors, error, pendingConnector } = useConnect({
    chainId: chain.polygon.id
  });
  const { disconnect } = useDisconnect();
  
  if (isConnected) {
    return (
      <div className="m-5">
        <div>Connected to {connector?.name}</div>
        <button
          className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
          onClick={() => {
            disconnect();
            if (isDisconnected) {window.location.reload()}
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="grid-rows-4 m-5">
      {connectors.map((_connector, index) => (
        <div key={index}>
        <button
          disabled={!_connector.ready}
          key={_connector.id}
          onClick={() => {
            connect({ connector: _connector })
          }}
          className="w-full h-12 px-6 my-2 text-gray-100 transition-colors duration-150 bg-black rounded-lg focus:shadow-outline hover:bg-gray-800"
        >
          {_connector.name}
          {!_connector.ready && " (unsupported)"}
          {(isConnecting || isReconnecting ) &&
            _connector.id === pendingConnector?.id &&
            " (connecting)"}
        </button></div>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  );
}
