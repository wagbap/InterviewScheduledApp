﻿using DataAccessLayer.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Repository
{
    public interface IAppointInterface
    {
        object FinishAppointment(int userId, int appointmentId);
        List<MessageModel> GetMessageByAppointId(int appointmentId, int userId);
        object AddMessage(int userId, int appointmentId, string message);
        AppointmentModel CreateAppointment(int doctorId, int patientId, string? patientMessage = null);
        List<AppointmentModel> GetAppointmentId(int userId, int? appointmentId = null);

        FileUser GetPdfByAppointment(int appointId);

    }

}