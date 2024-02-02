export default function SellOrder({ active, toolbarSelect }) {
    return (
        <div className="sell-order-container">
            {active && <div className="sell-order-indicator">
                <div className="so-top"></div>
                <div className="so-bottom">
                    <h6 className="so-text">Sell first</h6>
                    <h6 className="so-text">Sell last</h6>
                </div>
            </div>}
            <button className={`flex flex-row absolute left-0 text-black bottom-0 w-max justify-center items-center p-2 rounded-lg bg-white ${active ? 'bg-zinc-200' : ''}`} onClick={() => toolbarSelect(4)}>
                Sell order
            </button>
        </div>
    )
}