import { createApplication } from 'graphql-modules'
import { CommonModule } from './common'
import { DentistModule } from './dentist'
import { UserModule } from './user'
import { AppointmentModule } from './appointment'

const app = createApplication({
  modules: [CommonModule, DentistModule, UserModule, AppointmentModule],
})

export default app.createSchemaForApollo()
