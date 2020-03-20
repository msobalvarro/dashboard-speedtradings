import toastr from 'toastr'

export const urlServer = "http://localhost:8080"

export const Toast = (type = 'info' | 'success' | 'warning' | 'error', msg = '') => {
    toastr[type](msg)
}