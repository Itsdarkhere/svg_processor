export default function ToolBar({ activeMapAction, toolbarSelect }) {
    return (
        <div className="absolute right-10 top-10 flex flex-col bg-white rounded-md px-2">
            <button className={`p-3`} onClick={() => toolbarSelect(3)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.96591 17.6252L3.98524 4.99568C3.79009 2.48236 6.59385 0.863609 8.67287 2.28928L19.12 9.45331C21.2382 10.9058 20.6707 14.175 18.1869 14.8287L14.502 15.7985L17.3657 20.7584C17.6418 21.2367 17.4779 21.8483 16.9997 22.1245C16.5214 22.4006 15.9098 22.2367 15.6336 21.7584L12.77 16.7985L10.0877 19.5048C8.27967 21.3289 5.16474 20.1858 4.96591 17.6252ZM6.95991 17.4704L5.97924 4.84085C5.91419 4.00308 6.84878 3.4635 7.54178 3.93872L17.9889 11.1028C18.695 11.5869 18.5058 12.6766 17.6779 12.8945L13.7818 13.9199C12.9185 14.1471 12.1317 14.6014 11.5032 15.2355L8.66715 18.0969C8.06449 18.705 7.02618 18.3239 6.95991 17.4704Z"
                        fill={activeMapAction === 3 ? '#3E8BF7' : '#141416'} />
                </svg>
            </button>
            <button className={`p-3`} onClick={() => toolbarSelect(2)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_385_306579)">
                        <path d="M5 10C3.9 10 3 10.9 3 12C3 13.1 3.9 14 5 14C6.1 14 7 13.1 7 12C7 10.9 6.1 10 5 10ZM19 10C17.9 10 17 10.9 17 12C17 13.1 17.9 14 19 14C20.1 14 21 13.1 21 12C21 10.9 20.1 10 19 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"
                            fill={activeMapAction === 2 ? '#3E8BF7' : '#141416'} />
                    </g>
                    <defs>
                        <clipPath id="clip0_385_306579">
                            <rect width="24" height="24" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </button>
            <button className={`p-3`} onClick={() => toolbarSelect(1)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M2 5C2 3.34315 3.34315 2 5 2H19C20.6569 2 22 3.34315 22 5V19C22 20.6569 20.6569 22 19 22H5C3.34315 22 2 20.6569 2 19V5ZM16 4H19C19.5523 4 20 4.44771 20 5V8H16V4ZM14 4H10V8H14V4ZM8 4H5C4.44771 4 4 4.44772 4 5V8H8V4ZM4 10V14H8V10H4ZM4 16V19C4 19.5523 4.44772 20 5 20H8V16H4ZM10 20H14V16H10V20ZM16 20H19C19.5523 20 20 19.5523 20 19V16H16V20ZM20 14V10H16V14H20ZM14 10V14H10V10H14Z"
                        fill={activeMapAction === 1 ? '#3E8BF7' : '#141416'} />
                </svg>
            </button>
        </div>
    )
}