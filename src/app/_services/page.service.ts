import eventsService from "./events.service"

class PageService {

    status: string
    irn: string
    wallet: string
    nav: string

    public setStatus(status: string) {
        this.status = status
        localStorage.setItem("status", `${this.status}`)
    }

    public getStatus(): string {
        return this.status || localStorage.getItem("status")
    }

    public setIrn(irn: string) {
        this.irn = irn
        localStorage.setItem("irn", `${this.irn}`)
    }

    public getIrn(): string {
        return this.irn || localStorage.getItem("irn")
    }

    setWallet(wallet: string) {
        this.wallet = wallet
        localStorage.setItem("wallet", `${this.wallet}`)
    }

    getWallet(): string {
        return this.wallet || localStorage.getItem("wallet")
    }

    setNav(nav: string = "") {

        if(nav == ('/')){
            this.nav = "Summary View"
        }

        else if (nav.includes('/dashboard')) {

            this.nav = "Summary View"

        } else if (nav.includes('/status')) {

            let status = this.getStatus()

            if (status) {
                status = status.substring(0, 1).toUpperCase() + status.substring(1)

                this.nav = `${status} Wallet`

                if(status == "Not_in_use"){
                    this.nav = 'Not In Use Wallet'
                }
            }


        } else if (nav.includes('/agent-profile')) {

            this.nav = "Agent Profile"

        } else if (nav.includes('/trade-partner')) {
            this.nav = "Trade Partner"

        } else if (nav.includes('/nip-transaction')) {
            this.nav = "Nip Transactions"

        } else if (nav.includes('/register')) {
            this.nav = "Register User"

        } else if (nav.includes('/update')) {
            this.nav = "Update User"
        } else {
            this.nav = "Unknown"
        }
    }

    getNav(): string {
        return this.nav
    }

}

export default new PageService()