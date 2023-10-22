using System;
using AutoMapper;  // Make sure to import AutoMapper namespace
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DataAccessLayer.Model
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<EntrevistaDTO, Entrevista>();
            CreateMap<Entrevista, EntrevistaDTO>();
        }
    }
}
